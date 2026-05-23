/* =================================================================
   News 文章結構化資料產生器
   產出單一 @graph JSON-LD blob，包含：
     - BlogPosting        （主體文章 + speakable）
     - BreadcrumbList     （麵包屑）
     - FAQPage            （若 article 有 faq）
     - ItemList           （若 article.is_listicle = true）
     - Restaurant[]       （article.related_restaurants 對應的門市）
   外部呼叫：buildArticleJsonLd({ article, content, locale, restaurants, author, siteUrl })
   ================================================================= */

const SITE_NAME_ZH = "有香餐飲集團";
const SITE_NAME_EN = "Memory Corner Group";

function getLocaleField(article, baseField, locale) {
  const suffix = locale === "en" ? "_en" : "_zh";
  return article[baseField + suffix] || article[baseField + "_zh"] || "";
}

function getRestaurantName(r, locale) {
  return locale === "en" ? r.name_en : r.name_zh;
}

function buildBlogPostingNode({ article, content, locale, author, siteUrl, articleUrl, faqAvailable }) {
  const title = content?.title || getLocaleField(article, "title", locale);
  const description = getLocaleField(article, "desc", locale);
  const keywords = locale === "en" ? article.keywords_en : article.keywords_zh;
  const imageUrl = `${siteUrl}${article.img}`;
  const datePublished = article.date;
  const dateModified = article.dateModified || article.date;

  const speakableSelectors = [".article-quick-answer", ".article-faq-answer"];
  if (!faqAvailable) speakableSelectors.pop();

  return {
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: title,
    description,
    image: [imageUrl],
    datePublished,
    dateModified,
    inLanguage: locale === "en" ? "en-CA" : "zh-Hant",
    keywords: Array.isArray(keywords) && keywords.length ? keywords.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: author.name,
      description: locale === "en" ? author.bio_en : author.bio_zh,
      jobTitle: locale === "en" ? author.role_en : author.role_zh,
      ...(author.url ? { url: author.url } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: locale === "en" ? SITE_NAME_EN : SITE_NAME_ZH,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo/youxiang-group-logo.png`,
      },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors,
    },
  };
}

function buildBreadcrumbNode({ siteUrl, articleUrl, title, locale }) {
  const homeName = locale === "en" ? "Home" : "首頁";
  const newsName = locale === "en" ? "News" : "品牌動態";
  const homeUrl = locale === "en" ? `${siteUrl}/en` : siteUrl;
  const newsUrl = locale === "en" ? `${siteUrl}/en/news` : `${siteUrl}/news`;
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: homeUrl },
      { "@type": "ListItem", position: 2, name: newsName, item: newsUrl },
      { "@type": "ListItem", position: 3, name: title, item: articleUrl },
    ],
  };
}

function buildFaqNode({ faq, articleUrl }) {
  if (!Array.isArray(faq) || faq.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": `${articleUrl}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function buildItemListNode({ items, articleUrl, locale }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    "@type": "ItemList",
    "@id": `${articleUrl}#itemlist`,
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: locale === "en" ? it.name_en || it.name : it.name_zh || it.name,
      url: it.url,
    })),
  };
}

function buildRestaurantNode(r, locale, siteUrl) {
  return {
    "@type": r.type || "Restaurant",
    "@id": `${siteUrl}/#${r.id}`,
    name: getRestaurantName(r, locale),
    servesCuisine: r.cuisine,
    telephone: r.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.streetAddress,
      addressLocality: r.addressLocality,
      addressRegion: r.addressRegion,
      postalCode: r.postalCode,
      addressCountry: r.addressCountry,
    },
    geo: r.geo
      ? { "@type": "GeoCoordinates", latitude: r.geo.latitude, longitude: r.geo.longitude }
      : undefined,
    openingHoursSpecification: r.hours_schema?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    image: r.img ? `${siteUrl}${r.img}` : undefined,
    hasMap: r.mapUrl,
    url: siteUrl,
  };
}

function buildArticleJsonLd({ article, content, locale, restaurants, author, siteUrl }) {
  const localePrefix = locale === "en" ? "/en" : "";
  const articleUrl = `${siteUrl}${localePrefix}/news/${article.slug}`;
  const title = content?.title || getLocaleField(article, "title", locale);
  const faq = content?.faq;
  const faqAvailable = Array.isArray(faq) && faq.length > 0;

  const graph = [
    buildBlogPostingNode({ article, content, locale, author, siteUrl, articleUrl, faqAvailable }),
    buildBreadcrumbNode({ siteUrl, articleUrl, title, locale }),
  ];

  const faqNode = buildFaqNode({ faq, articleUrl });
  if (faqNode) graph.push(faqNode);

  if (article.is_listicle) {
    const itemListNode = buildItemListNode({
      items: content?.list_items || [],
      articleUrl,
      locale,
    });
    if (itemListNode) graph.push(itemListNode);
  }

  if (Array.isArray(restaurants) && restaurants.length > 0) {
    restaurants.forEach((r) => graph.push(buildRestaurantNode(r, locale, siteUrl)));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

module.exports = { buildArticleJsonLd };
