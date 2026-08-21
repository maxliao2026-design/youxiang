"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "./Layout";
import Link from "next/link";
import { cartStore } from "@/lib/cartStore";
import { isBeerProduct } from "@/lib/cartUtils";

const PLACEHOLDER = "https://dummyimage.com/80x80/eeeeee/999999.png&text=%20";

/* =================================================================
   1. Static UI Translations
   ================================================================= */
const PAGE_TRANSLATIONS = {
  "zh-TW": {
    title: "感謝您的訂購！",
    subtitle: "我們已收到您的訂單，將盡快為您處理。",
    missing_id: "找不到訂單編號",
    loading: "讀取訂單資料中...",
    order_info: "訂單資訊",
    order_number: "訂單編號",
    order_date: "下單日期",
    payment_method: "付款方式",
    total_amount: "總金額",
    shipping_info: "收件資訊",
    item_list: "商品清單",
    quantity: "數量",
    order_total: "訂單總計",
    no_items: "無商品資料",
    footer_text: "若有任何問題，請隨時聯絡我們的客服。",
    back_home_prefix: "或回到",
    back_home_link: "首頁",
    back_home_suffix: "瀏覽更多商品。",
    currency: "NT$",
    pending_beer_title: "您的購物車還有 {n} 件啤酒尚未結帳",
    pending_beer_desc: "啤酒需另於「憶點點」自取結帳，與本筆訂單分開處理。",
    pending_beer_cta: "前往啤酒結帳",
    pending_general_title: "您的購物車還有 {n} 件團購商品尚未結帳",
    pending_general_desc: "團購商品需另於「有香ㄟ灶腳」結帳（自取或宅配），與本筆訂單分開處理。",
    pending_general_cta: "前往一般結帳",
  },
  en: {
    title: "Thank You for Your Order!",
    subtitle: "We have received your order and will process it shortly.",
    missing_id: "Missing Order ID",
    loading: "Loading Order Data...",
    order_info: "Order Information",
    order_number: "Order Number",
    order_date: "Order Date",
    payment_method: "Payment Method",
    total_amount: "Total Amount",
    shipping_info: "Shipping Information",
    item_list: "Item List",
    quantity: "Qty",
    order_total: "Order Total",
    no_items: "No items found",
    footer_text:
      "If you have any questions, please contact our customer support.",
    back_home_prefix: "Or go back to ",
    back_home_link: "Home",
    back_home_suffix: " to browse more products.",
    currency: "NT$",
    pending_beer_title: "You still have {n} beer item(s) in your cart",
    pending_beer_desc: "Beer is checked out separately for pickup at Sweet Memory.",
    pending_beer_cta: "Go to Beer Checkout",
    pending_general_title: "You still have {n} group-buy item(s) in your cart",
    pending_general_desc: "Group-buy items are checked out separately at Old Memory Kitchen (pickup or delivery).",
    pending_general_cta: "Go to Checkout",
  },
};

export default function ThankYouPage() {
  const router = useRouter();
  // 修正 1: 從 query 拿 id，並使用 isReady
  const { query, locale, isReady } = router;
  const id = query?.id;

  const t = PAGE_TRANSLATIONS[locale] || PAGE_TRANSLATIONS["zh-TW"];
  const isEn = locale === "en";

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 新增 loading 狀態控制

  // 拆單提醒：食品與啤酒分開結帳，下單後另一批仍留在購物車，這裡提示客人去結另一筆
  const [remainingCart, setRemainingCart] = useState([]);
  useEffect(() => {
    cartStore.init();
    return cartStore.subscribe((c) => setRemainingCart(c || []));
  }, []);
  const pendingBeer = remainingCart
    .filter(isBeerProduct)
    .reduce((n, it) => n + (it.qty || 0), 0);
  const pendingGeneral = remainingCart
    .filter((it) => !isBeerProduct(it))
    .reduce((n, it) => n + (it.qty || 0), 0);
  const pending =
    pendingBeer > 0
      ? { n: pendingBeer, kind: "beer", href: "/checkout-beer" }
      : pendingGeneral > 0
        ? { n: pendingGeneral, kind: "general", href: "/checkout" }
        : null;

  // 1. Fetch Order Data
  useEffect(() => {
    // 如果 router 還沒準備好，或是沒有 id，就先不執行
    if (!isReady) return;
    if (!id) {
      // 如果 ready 了但還是沒有 id，才視為錯誤
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/wc/order?id=${id}`);
        const data = await resp.json();

        if (!resp.ok || !data?.id) {
          setError(
            data?.message || (isEn ? "Failed to load order" : "讀取訂單失敗")
          );
        } else {
          setOrder(data);
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isReady, isEn]); // 加入 isReady 作為依賴

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isEn ? "en-US" : "zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 渲染邏輯優化
  // 1. 如果 Router 還沒準備好，顯示空白或 Loading
  if (!isReady) {
    return (
      <Layout>
        <div className="bg-[#f5f4f4] pt-20 min-h-screen flex items-center justify-center">
          <p className="text-gray-500">{t.loading}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#f5f4f4] pt-20">
        <main className="max-w-5xl mx-auto py-16 px-6 ">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-2 tracking-wide">
              {t.title}
            </h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {pending && (
            <div className="mb-10 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-amber-900">
                  {t[`pending_${pending.kind}_title`].replace("{n}", pending.n)}
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  {t[`pending_${pending.kind}_desc`]}
                </p>
              </div>
              <Link
                href={pending.href}
                className="shrink-0 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 text-center transition"
              >
                {t[`pending_${pending.kind}_cta`]} →
              </Link>
            </div>
          )}

          {/* 顯示邏輯：依序判斷 Loading -> Error -> Missing ID -> Content */}

          {loading ? (
            <p className="text-gray-500 text-center py-10">{t.loading}</p>
          ) : error ? (
            <p className="text-red-600 text-center py-10">{error}</p>
          ) : !id ? (
            <p className="text-gray-500 text-center py-10">{t.missing_id}</p>
          ) : order ? (
            <div className="grid gap-8 md:grid-cols-2 items-start">
              {/* Left Column */}
              <div className="space-y-8 md:order-1">
                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t.order_info}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] leading-relaxed">
                    <p>
                      <span className="text-gray-500">{t.order_number}：</span>
                      <span className="font-semibold">
                        #{order.number || order.id}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">{t.order_date}：</span>
                      <span className="font-medium">
                        {formatDate(order.date_created)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {t.payment_method}：
                      </span>
                      <span className="font-medium">
                        {order.payment_method_title}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">{t.total_amount}：</span>
                      <span className="font-bold text-gray-900">
                        {t.currency}
                        {order.total}
                      </span>
                    </p>
                  </div>
                </section>

                <section className="bg-white rounded-lg p-6">
                  <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                    {t.shipping_info}
                  </div>

                  <div className="space-y-1 text-[15px] leading-relaxed">
                    <p className="font-semibold">
                      {order.billing.first_name} {order.billing.last_name}
                    </p>
                    <p className="text-gray-700">{order.billing.address_1}</p>
                    <p className="text-gray-700">{order.billing.phone}</p>
                    <p className="text-gray-700">{order.billing.email}</p>
                  </div>
                </section>
              </div>

              {/* Right Column: Items */}
              <aside className="bg-white rounded-lg p-6 h-full md:order-2 md:sticky md:top-8 md:max-h-[75vh] overflow-auto">
                <div className="text-gray-900 rounded-md px-3 py-2 mb-5 font-semibold">
                  {t.item_list}
                </div>

                {order.line_items?.length ? (
                  <ul className="divide-y">
                    {order.line_items.map((item) => {
                      const imgSrc =
                        item?.image?.src ||
                        item?.image?.thumbnail ||
                        PLACEHOLDER;

                      let displayName = item.name;
                      if (isEn && item.name.includes("金牌台灣啤酒")) {
                        displayName =
                          "Gold Medal Taiwan Beer (Bottled) 24 Bottles";
                      }

                      return (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="shrink-0">
                              <Image
                                src={imgSrc}
                                alt={displayName}
                                width={64}
                                height={64}
                                className="rounded border object-contain w-16 h-16 bg-white"
                                unoptimized
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {displayName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t.quantity}：{item.quantity}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {t.currency}
                                {item.total}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">{t.no_items}</p>
                )}

                {/* Total */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-[15px] mb-2">
                    <span className="text-gray-600">{t.order_total}</span>
                    <span className="font-extrabold text-lg text-gray-900">
                      {t.currency}
                      {order.total}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          ) : null}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-600">
            <p>{t.footer_text}</p>
            <p className="mt-2">
              {t.back_home_prefix}
              <a href={isEn ? "/en" : "/"} className="text-blue-600 underline">
                {t.back_home_link}
              </a>
              {t.back_home_suffix}
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
}
