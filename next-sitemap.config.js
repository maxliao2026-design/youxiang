/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // 替換成你客戶的正式網址
  siteUrl: process.env.SITE_URL || 'https://www.memorycorner8.com',
  generateRobotsTxt: true, // 自動生成 robots.txt (強烈建議開啟)
  sitemapSize: 7000, // 當網址超過 7000 個會自動分割成多個 sitemap 檔案
  exclude: ['/server-sitemap.xml', '/api/*', '/account/*', '/checkout/*'],

  robotsTxtOptions: {
    // 政策：允許主流搜尋引擎 + AI 引擎（要被 ChatGPT/Claude/Perplexity 引用）；
    // 擋掉純爬資料、不帶流量的 SEO/廣告爬蟲
    policies: [
      // 1) 預設：所有未列名的爬蟲允許爬，但禁止 /api 等內部路徑
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/checkout/', '/_next/data/'],
      },
      // 2) 重要搜尋引擎：明確允許（含 AI search）
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },          // ChatGPT
      { userAgent: 'ClaudeBot', allow: '/' },       // Claude
      { userAgent: 'PerplexityBot', allow: '/' },   // Perplexity
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini / Google AI
      { userAgent: 'Amazonbot', allow: '/' },       // Alexa / Rufus
      { userAgent: 'OAI-SearchBot', allow: '/' },   // ChatGPT search
      // 3) 流量大戶但對小型餐廳無價值：全擋
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },    // 華為
      { userAgent: 'Bytespider', disallow: '/' },  // 字節跳動 / TikTok
      { userAgent: 'YandexBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'SeekportBot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/' },
      { userAgent: 'serpstatbot', disallow: '/' },
      { userAgent: 'MegaIndex', disallow: '/' },
    ],
  },

  // (可選) 針對特定頁面設定不同的優先級 (Priority) 或更新頻率 (Changefreq)
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority, // 讓首頁優先級最高
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}