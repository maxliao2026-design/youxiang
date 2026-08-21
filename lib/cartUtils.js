"use client";

/**
 * 啤酒判定 — 唯一真相來源。
 *
 * 商品加入購物車時，依來源頁面寫入 store_type：
 *   /beer、/beer/[slug]            → "beer"      （憶點點，唯一有酒牌）
 *   /groupBuy、/product/[slug]     → "group_buy" （有香ㄟ灶腳）
 * 後端 /api/wc/create-order 也用同一欄位決定通知對象並拒收混單。
 *
 * 不靠商品名稱關鍵字猜（「金牌 ONE 24罐」曾因名字沒有「啤酒」被當一般商品宅配）。
 * 購物車 key 已換成 cart:v2，所以不會再讀到沒有 store_type 的舊項目。
 * 新酒上架放在啤酒頁賣即可，不需改任何程式或命名。
 */
export const isBeerProduct = (item) => item?.store_type === "beer";

export const isGeneralProduct = (item) => !!item && !isBeerProduct(item);
