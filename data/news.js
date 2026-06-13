/* =================================================================
   品牌動態 — 貼文資料庫
   新增貼文時，在 ARTICLES 陣列最前面加一筆即可（最新的在最前面）

   欄位說明：
   - slug                 URL 識別字
   - date                 ISO 日期 (YYYY-MM-DD)
   - dateModified         可選；最後更新日期，未填則使用 date
   - img                  封面圖路徑
   - category             文章分類（membership / brand / guide / listicle）
   - author_id            對應 data/news-author.js 的作者 id
   - related_restaurants  此文章涉及的門市 id 陣列；["all"] = 全部門市
   - keywords_zh / _en    關鍵字陣列，注入 BlogPosting schema
   - is_listicle          true = 啟用 ItemList schema (適用 best-X / top-X 文章)
   - title_zh / desc_zh   中文標題與摘要
   - title_en / desc_en   英文標題與摘要
   ================================================================= */

const ARTICLES = [
  {
    slug: "taiwanese-dessert-richmond",
    date: "2026-06-12",
    img: "/images/news/taiwanese-dessert-richmond.webp",
    category: "guide",
    author_id: "jessica-lin",
    related_restaurants: ["store-sweet-memory", "store-youxiang-richmond"],
    keywords_zh: [
      "列治文 台式甜點",
      "台式甜點 Richmond",
      "憶點點",
      "Sweet Memory Richmond",
      "豆花 Richmond",
      "燒仙草 Richmond",
      "芒果凍",
      "台式手搖 Richmond",
      "Richmond 宵夜甜點",
      "糖水 Richmond",
    ],
    keywords_en: [
      "dessert richmond",
      "chinese dessert richmond",
      "taiwanese dessert richmond",
      "tofu pudding richmond",
      "tofu dessert richmond",
      "grass jelly richmond",
      "bubble tea richmond",
      "sweet memory richmond",
      "late night dessert richmond",
      "richmond dessert",
    ],
    is_listicle: false,
    title_zh:
      "列治文台式甜點宵夜｜憶點點 Sweet Memory：手工豆花・燒仙草・古早味手搖",
    desc_zh:
      "在 Richmond 想吃台式甜點？憶點點 Sweet Memory（8080 Leslie Rd #130）主打手工豆花（可加珍珠、粉粿、仙草凍等 14 種配料）、燒仙草、芒果凍與古早味甜品，搭配 15 款手搖奶茶；每天營業到凌晨 12:30。",
    title_en: "Taiwanese Dessert in Richmond: Sweet Memory (憶點點)",
    desc_en:
      "Craving Taiwanese dessert in Richmond? Sweet Memory (8080 Leslie Rd #130) serves handmade tofu pudding (douhua) with 14 toppings, grass jelly, mango jelly, mochi and thick toast, plus 15 hand-shaken milk teas — open late till 12:30 AM.",
  },
  {
    slug: "taiwanese-restaurant-dynamic-qr-menu-story",
    date: "2026-05-15",
    img: "/images/brand-story/memory-corner-01.png",
    category: "guide",
    author_id: "jessica-lin",
    related_restaurants: [
      "store-youxiang-richmond",
      "store-youxiang-coquitlam",
      "store-sweet-memory",
      "store-old-memory-kitchen",
    ],
    keywords_zh: [
      "餐廳 QR menu",
      "動態 QR code 餐廳",
      "台灣餐廳 數位菜單",
      "Memory Corner QR",
      "OwnQR 餐廳案例",
      "餐廳 QR code 故事",
      "Richmond 台菜 QR menu",
    ],
    keywords_en: [
      "restaurant QR menu",
      "dynamic QR code restaurant",
      "Taiwanese restaurant digital menu",
      "Memory Corner QR",
      "OwnQR restaurant case study",
      "QR code dish stories",
      "buy-once dynamic QR code",
    ],
    is_listicle: true,
    title_zh: "餐廳怎麼用動態 QR code 講菜色故事｜Memory Corner 的桌邊掃碼實作",
    desc_zh:
      "menu 上印不下的台灣故事，我們把它放進每道菜旁的 QR code。動態 QR 讓 Richmond 與 Coquitlam 兩家店共用同一張卡片，節慶菜色換內容不用重印——這篇分享我們怎麼設計餐廳場景的 QR 流程，以及用了哪套工具。",
    title_en:
      "How a Taiwanese Restaurant Uses Dynamic QR Codes for Dish Stories",
    desc_en:
      "The Taiwanese stories that don't fit on a menu now live behind QR codes beside each dish. Dynamic QR lets our Richmond and Coquitlam stores share the same printed cards, and seasonal swaps need no reprint — here's how we wired it up.",
  },
  {
    slug: "taiwanese-restaurant-coquitlam-north-rd",
    date: "2026-05-10",
    // 暫用 brand-story 既有 Coquitlam 店面照片（ASCII 檔名版，避開 Next/Image 中文檔名 bug）
    // 之後若有專拍封面可換成 /images/news/taiwanese-restaurant-coquitlam-north-rd.webp
    img: "/images/brand-story/memory-corner-coquitlam.webp",
    category: "brand",
    author_id: "jessica-lin",
    related_restaurants: [
      "store-youxiang-coquitlam",
      "store-youxiang-richmond",
    ],
    keywords_zh: [
      "Coquitlam 台菜餐廳",
      "Memory Corner Coquitlam",
      "有香 Coquitlam",
      "North Rd 台菜",
      "Tri-Cities 台菜",
      "Coquitlam 試營運",
      "Burnaby 邊台菜",
    ],
    keywords_en: [
      "Taiwanese restaurant Coquitlam",
      "Memory Corner Coquitlam",
      "North Rd Taiwanese restaurant",
      "authentic Taiwanese Tri-Cities",
      "Taiwanese cuisine Coquitlam BC",
      "Coquitlam soft opening Taiwanese",
      "Taiwanese restaurant near SFU",
    ],
    is_listicle: false,
    title_zh: "Memory Corner Coquitlam｜North Rd 試營運中",
    desc_zh:
      "Memory Corner（有香）已於 Coquitlam 345 North Rd 開設第二家門市，目前處於試營運期。對 Tri-Cities 與 Burnaby 北側居民，意味著吃道地台菜不用再開車去 Richmond。",
    title_en:
      "Memory Corner Coquitlam: Taiwanese Restaurant Soft Opening",
    desc_en:
      "Memory Corner (有香) has opened its second location at 345 North Rd, Coquitlam, now in soft opening — bringing authentic Taiwanese cuisine to Tri-Cities and north-Burnaby residents without the drive to Richmond.",
  },
  {
    slug: "authentic-taiwanese-restaurant-richmond",
    date: "2026-05-10",
    // 暫用 brand-story 既有官方照片；之後若有 1:1 方形定制封面，請改回 /images/news/authentic-taiwanese-restaurant-richmond.webp
    img: "/images/brand-story/memory-corner-01.png",
    category: "brand",
    author_id: "jessica-lin",
    related_restaurants: [
      "store-youxiang-richmond",
      "store-youxiang-coquitlam",
      "store-sweet-memory",
      "store-old-memory-kitchen",
    ],
    keywords_zh: [
      "Memory Corner Richmond",
      "有香 Memory Corner",
      "Richmond 台灣餐廳",
      "authentic 台菜 Richmond",
      "Garden City Road 台菜",
      "溫哥華 台菜餐廳",
      "Memory Corner Coquitlam",
    ],
    keywords_en: [
      "authentic Taiwanese restaurant Richmond",
      "Memory Corner Richmond BC",
      "where to eat Taiwanese in Richmond",
      "Taiwanese cuisine Metro Vancouver",
      "Garden City Road Taiwanese restaurant",
      "Memory Corner Coquitlam",
      "Taiwanese restaurant Vancouver BC",
    ],
    is_listicle: false,
    title_zh:
      "有香 Memory Corner Richmond｜正宗台菜・三代家族傳承",
    desc_zh:
      "從 1975 年高雄的吳家羊肉鍋，到 Richmond Garden City Road 的有香 Memory Corner——三代家族傳承的家常口味，配上把早期台灣街景搬進來的裝潢，是大溫想吃到「人情味」台菜時的去處。",
    title_en:
      "Memory Corner Richmond: Authentic Taiwanese in BC",
    desc_en:
      "From a 1975 Kaohsiung lamb hot pot shop to Richmond's Garden City Road, Memory Corner carries three generations of family recipes — paired with a dining room that recreates old Taiwan's street scenes.",
  },
  {
    slug: "taiwanese-convenience-store-vancouver",
    date: "2026-05-09",
    // 用實拍店面外觀照（Old Memory Kitchen 招牌、冷凍美食 / 零食標籤都看得到）
    // 之後若有 1:1 方形定制封面，請改回 /images/news/taiwanese-convenience-store-vancouver.webp
    img: "/images/brand-story/DSC07346.webp",
    category: "brand",
    author_id: "jessica-lin",
    related_restaurants: ["store-old-memory-kitchen", "store-sweet-memory"],
    keywords_zh: [
      "台味便利店 溫哥華",
      "Richmond 台灣零食",
      "有香ㄟ灶腳",
      "Old Memory Kitchen",
      "溫哥華 台灣冷凍料理",
      "8080 Leslie Rd",
    ],
    keywords_en: [
      "Taiwanese convenience store Vancouver",
      "Taiwanese grocery Richmond BC",
      "where to buy Taiwanese snacks Metro Vancouver",
      "Old Memory Kitchen Richmond",
      "frozen Taiwanese meals Vancouver",
      "Taiwanese imported snacks Richmond",
    ],
    is_listicle: false,
    title_zh: "走進有香ㄟ灶腳｜溫哥華台味便利店",
    desc_zh:
      "位於 Richmond 8080 Leslie Rd，有香ㄟ灶腳把台灣的零食、冷凍料理與料理包搬進大溫地區，是少見以「台味」為單一定位的便利店概念。",
    title_en:
      "Old Memory Kitchen: Taiwanese Convenience Store, Richmond",
    desc_en:
      "Tucked inside 8080 Leslie Rd in Richmond, Old Memory Kitchen brings Taiwan's snack aisles, frozen meals, and ready-to-cook packs to Metro Vancouver — a rare single-cuisine convenience-store concept.",
  },
  {
    slug: "membership-rewards",
    date: "2025-04-10",
    dateModified: "2026-05-09",
    img: "/images/news/membership-rewards.webp",
    category: "membership",
    author_id: "jessica-lin",
    related_restaurants: ["all"],
    keywords_zh: [
      "Memory Corner 會員",
      "有香 點數",
      "Richmond 台菜會員",
      "跨店累積點數",
      "台灣餐廳 溫哥華",
    ],
    keywords_en: [
      "Memory Corner membership",
      "Taiwanese restaurant Richmond rewards",
      "Vancouver Taiwanese loyalty program",
      "Sweet Memory points",
      "Old Memory Kitchen rewards",
    ],
    is_listicle: false,
    title_zh: "會員回饋計畫｜消費就有回饋",
    desc_zh: "加入會員，跨店累積點數，兌換專屬優惠。",
    title_en: "Membership Rewards | Earn Points on Every Purchase",
    desc_en:
      "Join our membership and earn points across all locations. Redeem for exclusive rewards.",
  },
];

module.exports = { ARTICLES };
