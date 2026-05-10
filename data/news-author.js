/* =================================================================
   News 文章作者人設
   用途：BlogPosting JSON-LD 的 author 欄位、文章 byline 顯示
   ================================================================= */

const AUTHORS = {
  "jessica-lin": {
    id: "jessica-lin",
    name: "Jessica Lin",
    name_zh: "Jessica Lin",
    role_zh: "Memory Corner 內容編輯",
    role_en: "Editorial, Memory Corner",
    bio_zh: "派駐溫哥華的編輯，專責 Memory Corner 集團的菜色介紹、門市資訊與餐桌文化內容。",
    bio_en: "Vancouver-based editor covering menu features, location guides, and table culture for the Memory Corner restaurant group.",
    // url 暫不指定避免指向不存在頁面；之後若有 /about 編輯頁可加上
  },
};

function getAuthor(id) {
  return AUTHORS[id] || AUTHORS["jessica-lin"];
}

module.exports = { AUTHORS, getAuthor };
