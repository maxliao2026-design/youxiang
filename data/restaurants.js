/* =================================================================
   有香餐飲集團 — 門市實體資料（單一資料源）
   用途：news 文章 schema、未來 LocalBusiness / Restaurant 結構化資料
   修改門市資訊請改這個檔案，所有引用會同步更新
   ================================================================= */

const RESTAURANTS = [
  {
    id: "store-youxiang-richmond",
    brand: "youxiang",
    name_zh: "有香｜經典台灣料理（Richmond）",
    name_en: "Memory Corner | Classic Taiwanese Cuisine (Richmond)",
    short_zh: "有香 Memory Corner (Richmond)",
    short_en: "Memory Corner (Richmond)",
    cuisine: "Taiwanese",
    type: "Restaurant",
    tel: "(604) 284-5434",
    streetAddress: "4651 Garden City Rd #1110",
    addressLocality: "Richmond",
    addressRegion: "BC",
    postalCode: "V6X 2K4",
    addressCountry: "CA",
    geo: { latitude: 49.1666, longitude: -123.1336 },
    hours_human:
      "Mon–Thu 11:30 AM – 10:00 PM\nFri 11:30 AM – 11:00 PM\nSat 11:30 AM – 2:45 PM, 4:00 PM – 11:00 PM\nSun 11:30 AM – 2:45 PM, 4:00 PM – 10:00 PM",
    hours_schema: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:30", closes: "22:00" },
      { dayOfWeek: ["Friday"], opens: "11:30", closes: "23:00" },
      { dayOfWeek: ["Saturday"], opens: "11:30", closes: "14:45" },
      { dayOfWeek: ["Saturday"], opens: "16:00", closes: "23:00" },
      { dayOfWeek: ["Sunday"], opens: "11:30", closes: "14:45" },
      { dayOfWeek: ["Sunday"], opens: "16:00", closes: "22:00" },
    ],
    img: "/images/brand-story/memory-corner-01.png",
    mapUrl: "https://maps.google.com/?q=4651+Garden+City+Rd+%231110,+Richmond,+BC+V6X+2K4",
  },
  {
    id: "store-youxiang-coquitlam",
    brand: "youxiang",
    name_zh: "有香｜經典台灣料理（Coquitlam）",
    name_en: "Memory Corner | Classic Taiwanese Cuisine (Coquitlam)",
    short_zh: "有香 Memory Corner (Coquitlam)",
    short_en: "Memory Corner (Coquitlam)",
    cuisine: "Taiwanese",
    type: "Restaurant",
    tel: "(604) 917-0168",
    streetAddress: "345 North Rd",
    addressLocality: "Coquitlam",
    addressRegion: "BC",
    postalCode: "V3K 3V8",
    addressCountry: "CA",
    geo: { latitude: 49.2487, longitude: -122.8869 },
    hours_human:
      "Sun–Thu 11:30 AM – 3:00 PM, 4:00 PM – 10:00 PM\nFri & Sat 11:30 AM – 3:00 PM, 4:00 PM – 11:00 PM",
    hours_schema: [
      { dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:30", closes: "15:00" },
      { dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "16:00", closes: "22:00" },
      { dayOfWeek: ["Friday", "Saturday"], opens: "11:30", closes: "15:00" },
      { dayOfWeek: ["Friday", "Saturday"], opens: "16:00", closes: "23:00" },
    ],
    img: "/images/brand-story/有香光采.webp",
    mapUrl: "https://maps.google.com/?q=345+North+Rd,+Coquitlam,+BC+V3K+3V8",
  },
  {
    id: "store-sweet-memory",
    brand: "memory",
    name_zh: "憶點點｜療癒甜點與鹹食",
    name_en: "Sweet Memory | Sweet & Savoury Delights",
    short_zh: "憶點點 Sweet Memory",
    short_en: "Sweet Memory",
    cuisine: "Taiwanese",
    type: "Restaurant",
    tel: "(604) 370-2882",
    streetAddress: "8080 Leslie Rd #130",
    addressLocality: "Richmond",
    addressRegion: "BC",
    postalCode: "V6X 4A8",
    addressCountry: "CA",
    geo: { latitude: 49.1838, longitude: -123.1380 },
    hours_human:
      "Mon–Fri 5:00 PM – 12:30 AM\nSat & Sun 11:30 AM – 12:30 AM",
    hours_schema: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "17:00", closes: "00:30" },
      { dayOfWeek: ["Saturday", "Sunday"], opens: "11:30", closes: "00:30" },
    ],
    img: "/images/brand-story/憶點點/憶點點(1280 x 650 像素).webp",
    mapUrl: "https://maps.google.com/?q=8080+Leslie+Rd+%23130,+Richmond,+BC+V6X+4A8",
  },
  {
    id: "store-old-memory-kitchen",
    brand: "corner",
    name_zh: "有香ㄟ灶腳｜台味便利店",
    name_en: "Old Memory Kitchen | Taiwanese Convenience Store",
    short_zh: "有香ㄟ灶腳 Old Memory Kitchen",
    short_en: "Old Memory Kitchen",
    cuisine: "Taiwanese",
    type: "ConvenienceStore",
    tel: "(778) 723-1685",
    streetAddress: "8080 Leslie Rd #150",
    addressLocality: "Richmond",
    addressRegion: "BC",
    postalCode: "V6X 4A8",
    addressCountry: "CA",
    geo: { latitude: 49.1838, longitude: -123.1380 },
    hours_human: "Daily 10:00 AM – 7:00 PM",
    hours_schema: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "19:00" },
    ],
    img: "/images/brand-story/有香ㄟ灶腳上方(1280 x 650 像素).webp",
    mapUrl: "https://maps.google.com/?q=8080+Leslie+Rd+%23150,+Richmond,+BC+V6X+4A8",
  },
];

function getRestaurantsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  if (ids.includes("all")) return RESTAURANTS;
  return RESTAURANTS.filter((r) => ids.includes(r.id));
}

module.exports = { RESTAURANTS, getRestaurantsByIds };
