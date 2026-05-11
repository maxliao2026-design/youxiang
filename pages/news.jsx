"use client";
import Layout from "./Layout";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { ARTICLES } from "../data/news";

/* =================================================================
   1. 靜態 UI 翻譯資料庫
   ================================================================= */
const PAGE_TRANSLATIONS = {
  "zh-TW": {
    prev: "上一頁",
    next: "下一頁",
    home: "首頁",
    news: "品牌動態",
  },
  en: {
    prev: "Prev",
    next: "Next",
    home: "Home",
    news: "News",
  },
};

/* =================================================================
   2. 設定
   ================================================================= */
const PAGE_SIZE = 8;
const spring = { type: "spring", stiffness: 70, damping: 22, mass: 0.9 };

/* 父層 variants：加入 staggerChildren 控制子元素依序進場 */
const listVariants = (reduce) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: reduce ? 0 : 0.085,
      delayChildren: reduce ? 0 : 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
});

/* 單卡片 variants */
const cardVariants = {
  hidden: { opacity: 0, y: 96, filter: "blur(10px)", scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { ...spring },
  },
};

export default function News() {
  const { locale } = useRouter();
  const t = PAGE_TRANSLATIONS[locale] || PAGE_TRANSLATIONS["zh-TW"];
  const isEn = locale === "en";

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ARTICLES.length / PAGE_SIZE));
  const reduce = useReducedMotion();

  // 切換頁面或語言時，滾動到頂部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, locale]);

  const currentItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ARTICLES.slice(start, start + PAGE_SIZE);
  }, [page]);

  const MotionLink = motion(Link);

  return (
    <Layout>
      <LazyMotion features={domAnimation}>
        <MotionConfig transition={spring} reducedMotion="user">
          <section className="py-[120px] bg-[#ede5d6]">
            {/* 麵包屑導覽 */}
            <div className="mx-auto w-full md:w-[90%] px-5 xl:w-[85%] max-w-[1400px] mb-8">
              <nav className="flex items-center text-sm text-gray-500 font-medium">
                <Link
                  href="/"
                  className="hover:text-black text-[18px] transition-colors"
                >
                  {t.home}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-black cursor-default text-[18px] ">
                  {t.news}
                </span>
              </nav>
            </div>

            <div
              className="mx-auto w-full md:w-[90%] px-5 xl:w-[85%] max-w-[1400px]
                         grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${page}-lang-${locale}`}
                  className="contents"
                  variants={listVariants(reduce)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {currentItems.map((n, i) => {
                    const title = isEn ? n.title_en : n.title_zh;
                    const desc = isEn ? n.desc_en : n.desc_zh;

                    return (
                      <MotionLink
                        href={`/news/${n.slug}`}
                        key={`${page}-${i}-lang-${locale}`}
                        className="block will-change-transform"
                        whileTap={{ scale: 0.98 }}
                        style={{ transform: "translateZ(0)" }}
                        layout
                      >
                        <motion.article
                          layout
                          variants={cardVariants}
                          className="flex flex-col"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitFontSmoothing: "antialiased",
                            willChange: "transform, opacity, filter",
                          }}
                        >
                          <div className="relative aspect-[1/1] border-2 border-black overflow-hidden">
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              transition={spring}
                              className="w-full h-full"
                            >
                              <Image
                                src={n.img}
                                alt={title}
                                fill
                                className="object-cover w-full"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                priority={i < 4}
                              />
                            </motion.div>
                          </div>

                          <div className="pt-1">
                            <div className="px-3 py-5">
                              <p className="text-[14px] text-gray-500 mb-2">
                                {n.date}
                              </p>
                              <h2 className="text-[22px] sm:text-[24px] font-semibold leading-tight text-black mb-2">
                                {title}
                              </h2>
                              <p className="text-[15px] text-gray-600 leading-relaxed">
                                {desc}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      </MotionLink>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              t={t}
            />
          </section>
        </MotionConfig>
      </LazyMotion>
    </Layout>
  );
}

function Pagination({ page, totalPages, onChange, t }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = (s, e) => {
    for (let i = s; i <= e; i++) pages.push(i);
  };

  if (totalPages <= 7) {
    range(1, totalPages);
  } else {
    const l = Math.max(2, page - 1);
    const r = Math.min(totalPages - 1, page + 1);
    pages.push(1);
    if (l > 2) pages.push("...");
    range(l, r);
    if (r < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  const itemBase =
    "inline-flex items-center justify-center min-w-9 h-9 rounded-full text-sm transition select-none";
  const btnBase =
    "px-3 h-9 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm";

  return (
    <div className="mt-10 flex flex-wrap gap-3 justify-center">
      <motion.button
        className={btnBase}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={t.prev}
        whileTap={{ scale: 0.96 }}
      >
        {t.prev}
      </motion.button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="inline-flex items-center justify-center w-9 h-9 text-gray-400"
          >
            …
          </span>
        ) : (
          <motion.button
            key={`p-${p}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            whileTap={{ scale: 0.96 }}
            className={[
              itemBase,
              p === page
                ? "bg-black text-white"
                : "border border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            {p}
          </motion.button>
        )
      )}

      <motion.button
        className={btnBase}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label={t.next}
        whileTap={{ scale: 0.96 }}
      >
        {t.next}
      </motion.button>
    </div>
  );
}
