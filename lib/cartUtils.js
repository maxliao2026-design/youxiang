"use client";

/**
 * 啤酒判定 — 唯一真相來源。
 *
 * 加入購物車時（pages/beer.jsx、pages/beer/[slug].jsx、pages/groupBuy.jsx、
 * pages/product/[slug].jsx）都會寫入 store_type: "beer" | "group_buy"，
 * 後端 /api/wc/create-order 也是用同一個欄位判斷通知對象。
 * 前端以前用商品名稱關鍵字猜（beer/啤酒/台啤…），「金牌 ONE 24罐」這種名字
 * 會漏網，導致啤酒被當一般商品宅配、稅率錯、通知雙發。所以這裡以 store_type 為準。
 *
 * 舊版購物車（localStorage 裡沒有 store_type 的項目）才退回名稱關鍵字判斷。
 */
const BEER_KEYWORDS = [
  "beer", "啤酒", "台啤", "生啤", "draft", "金牌", "heineken", "kirin",
];

export const isBeerProduct = (item) => {
  if (!item) return false;
  if (item.store_type) return item.store_type === "beer";
  const names = [item.name, item.name_zh, item.name_en]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
  return names.some((n) => BEER_KEYWORDS.some((k) => n.includes(k)));
};

export const isGeneralProduct = (item) => !!item && !isBeerProduct(item);
