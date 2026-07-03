// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  // ✅ 新增：多語系設定 (Pages Router 專用)
  i18n: {
    // 支援的語言：英文、繁體中文
    locales: ["en", "zh-TW"],
    // 預設語言：繁體中文
    defaultLocale: "zh-TW",
    // 建議關閉自動偵測，避免 SEO 混淆或使用者體驗不一致
    localeDetection: false,
  },

  images: {
    // Next/Image 自動產生 WebP/AVIF + 各尺寸 srcset；大幅降低流量
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "inf.fjg.mybluehost.me", pathname: "/**" },
      { protocol: "https", hostname: "i0.wp.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "image.memorycorner8.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // 邊緣快取一年；新版本上線 Vercel 會自動產生新的圖片 URL
    minimumCacheTTL: 31536000,
  },

  // ✅ 關閉尾斜線，避免 /api/.../ 404
  trailingSlash: false,

  // 加盟企劃書（密碼加密靜態頁）：/franchise → public/franchise.html
  // locale:false 避免 i18n 前綴改寫；/en/franchise 也導到同一份
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/franchise", destination: "/franchise.html", locale: false },
        { source: "/en/franchise", destination: "/franchise.html", locale: false },
        { source: "/zh-TW/franchise", destination: "/franchise.html", locale: false },
      ],
    };
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: ["babel-loader", "babel-plugin-glsl"],
    });
    return config;
  },
};