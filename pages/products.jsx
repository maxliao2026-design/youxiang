"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "./Layout";
import { motion, AnimatePresence } from "framer-motion";
import { cartStore } from "@/lib/cartStore";

/* ---- WooCommerce 分類 (依照你後台設定 slug) ---- */
const CATEGORIES = [
  { name: "全部 All", slug: "" }, // ✅ 新增「全部」
  { name: "小吃 Snacks", slug: "snacks" },
  { name: "湯品 Soups", slug: "soups" },
  { name: "湯麵 Noodle Soups", slug: "noodle-soups" },
  { name: "火鍋 Hot Pot", slug: "hot-pot" },
  { name: "炒飯 Fried Rice", slug: "fried-rice" },
  { name: "甜品 Desserts", slug: "desserts" },
  { name: "飲品 Beverages", slug: "beverages" },
  { name: "馬上即享 Ready to Enjoy", slug: "ready-to-enjoy" },
];

/* ---- 讀取保存方式標籤 ---- */
const storageTagsFromProduct = (p) => {
  if (!p || !Array.isArray(p.attributes)) return [];
  const attr = p.attributes.find((a) => {
    const slug = String(a?.slug || "").toLowerCase();
    const tax = String(a?.taxonomy || "").toLowerCase();
    const name = String(a?.name || "").toLowerCase();
    return (
      name.includes("保存方式") ||
      slug === "storage" ||
      slug === "pa_storage" ||
      tax === "pa_storage"
    );
  });
  if (!attr) return [];
  if (Array.isArray(attr.terms) && attr.terms.length > 0) {
    return attr.terms.map((t) => t.name).filter(Boolean);
  }
  if (Array.isArray(attr.options) && attr.options.length > 0) {
    return attr.options.map((s) => String(s).trim()).filter(Boolean);
  }
  return [];
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qtyMap, setQtyMap] = useState({});
  const [toast, setToast] = useState(null);

  // 當前選中的分類（預設顯示全部）
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].slug);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // ✅ 如果 activeCat 為空，就抓全部
        const url = `/api/store/products?per_page=48${
          activeCat ? `&category=${activeCat}` : ""
        }`;
        const r = await fetch(url);
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
        const init = Object.fromEntries(
          (Array.isArray(data) ? data : []).map((p) => [p.id, 1])
        );
        setQtyMap(init);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCat]);

  const setQty = (id, next) =>
    setQtyMap((m) => ({
      ...m,
      [id]: Math.max(0, Number.isFinite(+next) ? +next : 0),
    }));

  // Toast
  const toastTimerRef = useRef(null);
  const showToast = (text) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    setToast({ id, text });
    toastTimerRef.current = setTimeout(() => setToast(null), 1600);
  };
  useEffect(
    () => () => toastTimerRef.current && clearTimeout(toastTimerRef.current),
    []
  );

  const addToCart = (p) => {
    const q = qtyMap[p.id] ?? 0;
    if (q <= 0) return;
    const priceNumber = p?.prices?.price ? Number(p.prices.price) / 100 : 0;
    const img = p?.images?.[0]?.src || "/images/placeholder.png";

    cartStore.add(
      { id: p.id, name: p.name, img, price: priceNumber, sku: p.sku || "" },
      q
    );
    showToast(`「${p.name}」已加入購物車（${q} 件）`);
    setQty(p.id, 0);
  };

  return (
    <Layout>
      <div className="bg-[#f4f1f1] pt-20 sm:pt-0">
        {/* Toast */}
        <div className="pointer-events-none fixed inset-0 z-[200] flex items-end justify-center">
          <AnimatePresence mode="wait">
            {toast && (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: -10, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mb-8 rounded-xl bg-black text-white px-4 py-2 shadow-lg"
              >
                {toast.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Banner */}
        <section>
          <Image
            src="/images/2025-10--ig-1920x1080px--8bfbd0295f.jpg"
            alt="banner"
            width={1920}
            height={1080}
            className="w-full"
          />
        </section>

        {/* Tabs 區塊（桌機：按鈕列、手機：下拉選單） */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* 🔹 手機版 Dropdown */}
          <div className="block sm:hidden w-[80%] max-w-[300px]">
            <select
              value={activeCat}
              onChange={(e) => setActiveCat(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 桌機版 Tabs */}
          <div className="hidden sm:flex justify-center gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                className={`px-5 py-2 rounded-full transition-all duration-500 ${
                  activeCat === c.slug
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 商品區 */}
        <section className="section-content min-h-screen pb-24">
          {loading ? (
            <div className="text-center py-20 text-gray-500">載入商品中…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              沒有符合的產品
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat} // 每次切換分類時重新動畫
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid max-w-[1600px] mx-auto w-[80%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 my-12"
              >
                {items.map((p) => {
                  const q = qtyMap[p.id] ?? 0;
                  const img = p?.images?.[0]?.src || "/images/placeholder.png";
                  const price = p?.prices?.price
                    ? Number(p.prices.price) / 100
                    : null;
                  const tags = storageTagsFromProduct(p);
                  return (
                    <div
                      key={p.id}
                      className="item flex flex-col justify-center items-center group   bg-white p-4  hover:shadow-md transition"
                    >
                      {/* 商品圖 */}
                      <Link
                        href={`/product/${p.id}`}
                        aria-label={`${p.name} 內頁`}
                      >
                        <img
                          src={img}
                          alt={p.name}
                          className="w-[200px] h-auto transition-transform group-hover:scale-[1.05]"
                        />
                      </Link>

                      {/* 標題與價格 */}
                      <div className="item-info mt-3 text-center">
                        <b>{p.name}</b>
                        {price !== null && (
                          <div className="text-sm text-gray-600">
                            NT$ {price}
                          </div>
                        )}
                      </div>

                      {/* 保存方式標籤 */}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                          {tags.map((t, i) => {
                            const isCold = /冷藏/.test(t);
                            const isFrozen = /冷凍/.test(t);
                            const base =
                              "inline-block px-3 py-1 rounded text-xs";
                            const cls = isFrozen
                              ? "bg-red-100 text-red-800"
                              : isCold
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800";
                            return (
                              <span key={i} className={`${base} ${cls}`}>
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* 數量控制 */}
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => setQty(p.id, q - 1)}
                          className="rounded-xl border px-3 py-1"
                          disabled={q <= 0}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={q}
                          onChange={(e) =>
                            setQty(
                              p.id,
                              Math.max(0, parseInt(e.target.value || "0", 10))
                            )
                          }
                          className="w-16 rounded-xl border px-2 py-1 text-center"
                        />
                        <button
                          onClick={() => setQty(p.id, q + 1)}
                          className="rounded-xl border px-3 py-1"
                        >
                          +
                        </button>
                      </div>

                      {/* 加入購物車 */}
                      <button
                        onClick={() => addToCart(p)}
                        disabled={q <= 0}
                        className={`mt-3 rounded-xl px-4 py-2 text-white ${
                          q > 0
                            ? "bg-black hover:opacity-90"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        加入購物車
                      </button>

                      <Link
                        href={`/product/${p.id}`}
                        className="mt-2 text-xs underline underline-offset-4 hover:opacity-80"
                      >
                        產品資訊
                      </Link>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>
    </Layout>
  );
}
