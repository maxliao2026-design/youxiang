import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Layout from "../Layout";
import { ARTICLES } from "../../data/news";
import { getRestaurantsByIds } from "../../data/restaurants";
import { getAuthor } from "../../data/news-author";
import { buildArticleJsonLd } from "../../lib/seo/article-schema";

/* =================================================================
   貼文內容資料庫（中英文 HTML）
   key = slug，對應 data/news.js 裡的 slug

   每篇文章可填寫的欄位：
   - title          (必填) 文章標題
   - quick_answer   (建議) 1-2 句直接回答主要搜尋意圖；GEO 給 LLM 抓引用
   - content_html   (必填) 文章本體 HTML
   - faq            (建議) [{q, a}] 陣列；自動生成 FAQPage JSON-LD + 顯示為 accordion
   - list_items     (條件) 當文章 is_listicle=true 時，[{name_zh, name_en, url}]
   - cta_text       (可選) 底部 CTA 按鈕文字；不填則不顯示
   ================================================================= */
const CONTENT = {
  /* ─────────────────────────────────────────────────────────────
     #F（Coquitlam 試營運專文）目前已使用集團官方 Coquitlam 店面照
     之後若有專拍封面可換到 /images/news/taiwanese-restaurant-coquitlam-north-rd.webp
     ───────────────────────────────────────────────────────────── */
  "taiwanese-restaurant-coquitlam-north-rd": {
    "zh-TW": {
      title: "Memory Corner Coquitlam｜North Rd 試營運中",
      quick_answer:
        "Memory Corner（有香）已於 Coquitlam 345 North Rd 開設第二家門市，目前處於試營運期。試營運期間菜色較為精選，主要熱門菜（當歸羊肉鍋、台式三杯雞、有香鹽酥雞、蕃茄牛腩麵）都吃得到；午晚餐人均約 CAD $20–30。對 Tri-Cities（Coquitlam、Port Moody、Port Coquitlam）與 Burnaby 北側居民，意味著吃道地台菜不用再開車到 Richmond。",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">對住在 Coquitlam 的人，這代表什麼？</h2>
          <p class="mb-3">在大溫地區，台灣餐廳大多集中在 Richmond。對住在 Coquitlam、Port Moody、Port Coquitlam 的台僑家庭，或在 SFU 念書的台灣留學生來說，「想吃一頓道地台菜」常常意味著一場橫跨兩座橋的長途車程。</p>
          <p class="mb-3">這也是 Memory Corner（有香）跨出 Richmond 旗艦店、在 <strong>Coquitlam 345 North Rd</strong> 開出第二家門市的意義所在——把那份從 1975 年高雄吳家羊肉鍋傳承下來的家常台味，<strong>放到離你家更近的位置</strong>。</p>
          <p class="text-[14px] text-gray-600">三代家族故事與品牌脈絡，請見 <a href="/news/authentic-taiwanese-restaurant-richmond" class="text-[#c59b63] hover:underline">有香 Memory Corner Richmond 完整介紹</a>。</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">試營運期間，吃得到什麼？</h2>
          <p class="mb-4">「試營運」（soft opening）不是「半開」——是讓最早一批客人先體驗 Coquitlam 店風味的時期。試營運期間菜單較為精選，<strong>幾道熟客最常點的招牌菜，全部吃得到</strong>：</p>
          <figure class="my-4 -mx-1 sm:mx-0 max-w-md">
            <img src="/images/news/photos/lamb-hotpot.png" alt="當歸羊肉鍋 Angelica Root Lamb Hot Pot — 有香 Memory Corner 招牌料理，傳承自 1975 年高雄吳家羊肉鍋" class="rounded-lg w-full h-auto border border-stone-200 bg-white" loading="lazy" />
            <figcaption class="text-[13px] text-gray-500 mt-2 italic">當歸羊肉鍋——三代家族傳承的招牌，Coquitlam 試營運期同樣吃得到。</figcaption>
          </figure>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>當歸羊肉鍋</strong>（Angelica Root Lamb Hot Pot）—— 1975 年吳家羊肉鍋的直系血脈</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>台式三杯雞</strong>（Taiwanese Three-Cup Chicken）—— 醬油、麻油、米酒燒煮的台灣家常經典</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>有香鹽酥雞</strong>（Memory Corner Deep-Fried Popcorn Chicken）—— 台灣夜市的代表炸物</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>蕃茄牛腩麵</strong>（Tomato Beef Brisket Noodle Soup）—— 番茄熬湯、慢燉牛腩的湯麵</span>
            </li>
          </ul>
          <p class="mb-3">客單價：午餐與晚餐人均約 <strong>CAD $20–30</strong>，與 Richmond 店一致。</p>
          <p class="mb-3">服務方式：內用、外帶；採 walk-in 候位制（目前未開放線上／電話訂位、不主推第三方外送、未提供包場服務）。</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">與 Richmond 旗艦店有什麼不同？</h2>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="text-[15px] sm:text-[16px] mb-3">同品牌、同集團，差異主要在三件事：</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>菜單規模</strong>：Richmond 旗艦店提供完整菜單；Coquitlam 試營運期間為精選菜單，未來菜單也不會與 Richmond 完全相同。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>營業時段</strong>：Coquitlam 採午晚餐分時段（週日至四 11:30 AM–3:00 PM、4:00 PM–10:00 PM；週五六晚至 11:00 PM）。Richmond 旗艦店週一至四為連續營業，週末則分時段。</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>體驗整體性</strong>：Memory Corner 集團的另外兩個品牌——<a href="/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">有香ㄟ灶腳</a>（台味便利店）與憶點點 Sweet Memory（台式甜點與宵夜）——目前都在 Richmond 8080 Leslie Rd。想要「餐廳＋甜點＋家用冷凍包」三合一體驗，仍需到 Richmond。</span>
              </li>
            </ul>
          </div>
          <p class="text-[14px] text-gray-600">會員制度兩家共通，一個帳號跨店累積點數（CAD $1 = 10 點，1,600 點折抵 $10）。詳見 <a href="/news/membership-rewards" class="text-[#c59b63] hover:underline">會員回饋計畫</a>。</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">怎麼來：345 North Rd 的位置與動線</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="mb-1"><strong>📍 地址</strong>：345 North Rd, Coquitlam, BC V3K 3V8</p>
            <p class="mb-1"><strong>🕒 營業時間</strong>：週日至四 11:30 AM – 3:00 PM、4:00 PM – 10:00 PM；週五六 11:30 AM – 3:00 PM、4:00 PM – 11:00 PM</p>
            <p class="mb-1"><strong>☎ 電話</strong>：(604) 917-0168</p>
            <p class="mt-3 text-[14px] text-gray-600">North Rd 上、Coquitlam 與 Burnaby 交界處，距離 SFU Burnaby Mountain 校區開車約 20 分鐘，距離 Lougheed Town Centre SkyTrain 站約 5 分鐘車程。</p>
          </div>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">適合誰來吃？</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Coquitlam / Port Moody / Port Coquitlam 的台僑家庭</strong>：終於不用為了一頓台菜開車到 Richmond。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>SFU 留學生</strong>：從 Burnaby Mountain 下山約 20 分鐘車程，宿舍區跟室友揪一頓的好選擇。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>想搶先體驗試營運期的台菜愛好者</strong>：試營運期是新店風味最快回饋給品牌的階段，你的反饋會直接影響菜單後續走向。</span>
            </li>
          </ul>
        </section>
      `,
      faq: [
        {
          q: "Memory Corner Coquitlam 在哪裡？",
          a: "地址是 345 North Rd, Coquitlam, BC V3K 3V8，位於 Coquitlam 與 Burnaby 交界處的 North Rd 上。距離 Lougheed Town Centre SkyTrain 站約 5 分鐘車程，距離 SFU Burnaby Mountain 校區開車約 20 分鐘。電話 (604) 917-0168。",
        },
        {
          q: "「試營運」是什麼意思？菜單會慢慢開放嗎？",
          a: "試營運（soft opening）是新店面在正式全開前的過渡期，菜單較精選、營運流程持續調整。Memory Corner Coquitlam 在試營運期間提供當歸羊肉鍋、台式三杯雞、有香鹽酥雞、蕃茄牛腩麵等熱門招牌菜；後續菜單會視試營運期反饋與供應狀況持續更新，未來定型後也不會與 Richmond 完全相同。",
        },
        {
          q: "與 Richmond 店有什麼不同？",
          a: "同品牌、同集團、同熱門菜色，差別在於：Richmond 提供完整菜單，週一至四連續營業、週末分時段；Coquitlam 試營運期菜單較為精選，每日採午晚餐分時段（週日至四晚至 10 點、週五六晚至 11 點）。完整對照請見 Memory Corner Richmond 介紹文章。",
        },
        {
          q: "客單價大概多少？",
          a: "與 Richmond 店一致，午餐與晚餐人均約 CAD $20–30，依點菜內容浮動。",
        },
        {
          q: "需要訂位嗎？",
          a: "目前採 walk-in 候位制，到店登記 waiting list 即可，未開放線上或電話訂位。試營運期間人潮浮動，平日午後與下午茶時段相對好入座。",
        },
        {
          q: "從 SFU 或 Burnaby 北側過來方便嗎？",
          a: "從 SFU Burnaby Mountain 校區開車下山約 20 分鐘可達；從 Lougheed Town Centre SkyTrain 站開車約 5 分鐘。對住在 Burnaby 北部、Coquitlam、Port Moody 一帶的客人，是大溫地區現有最近的有香門市。",
        },
      ],
    },
    en: {
      title: "Memory Corner Coquitlam: Taiwanese Restaurant Soft Opening",
      quick_answer:
        "Memory Corner (有香) has opened its second location at 345 North Rd, Coquitlam, currently in soft opening. The opening menu is curated; the headline signatures (Angelica Root Lamb Hot Pot, Taiwanese Three-Cup Chicken, Memory Corner Deep-Fried Popcorn Chicken, Tomato Beef Brisket Noodle Soup) are available, with lunch and dinner averaging CAD $20–30 per person. For Tri-Cities (Coquitlam, Port Moody, Port Coquitlam) and north-Burnaby residents, this means authentic Taiwanese cuisine without the drive to Richmond.",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">What This Means for Tri-Cities Residents</h2>
          <p class="mb-3">Across Metro Vancouver, Taiwanese restaurants have largely concentrated in Richmond. For Taiwanese-Canadian families in Coquitlam, Port Moody, and Port Coquitlam — and for Taiwanese students at SFU — "let's get authentic Taiwanese tonight" has often meant a long drive across two bridges.</p>
          <p class="mb-3">That's the meaning behind Memory Corner (有香) stepping out of its Richmond flagship and opening a second location at <strong>345 North Rd, Coquitlam</strong> — bringing the family flavours carried from a 1975 Kaohsiung lamb hot pot shop <strong>closer to where you actually live</strong>.</p>
          <p class="text-[14px] text-gray-600">For the full three-generation family story, see <a href="/en/news/authentic-taiwanese-restaurant-richmond" class="text-[#c59b63] hover:underline">the Memory Corner Richmond guide</a>.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">What's Available During Soft Opening?</h2>
          <p class="mb-4">"Soft opening" doesn't mean "half-open" — it's the early window where the first wave of guests get to taste the Coquitlam location. The menu is curated during this period, and the dishes most regulars come back for are <strong>all available</strong>:</p>
          <figure class="my-4 -mx-1 sm:mx-0 max-w-md">
            <img src="/images/news/photos/lamb-hotpot.png" alt="Angelica Root Lamb Hot Pot at Memory Corner — the family signature dish, available at the Coquitlam location during soft opening" class="rounded-lg w-full h-auto border border-stone-200 bg-white" loading="lazy" />
            <figcaption class="text-[13px] text-gray-500 mt-2 italic">Angelica Root Lamb Hot Pot — three generations of family recipe, available at Coquitlam during soft opening.</figcaption>
          </figure>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Angelica Root Lamb Hot Pot</strong>（當歸羊肉鍋）— direct lineage from Grandpa Wu's 1975 Kaohsiung shop</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Taiwanese Three-Cup Chicken</strong>（台式三杯雞）— soy sauce, sesame oil, rice wine in the classic three-cup home preparation</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Memory Corner Deep-Fried Popcorn Chicken</strong>（有香鹽酥雞）— Taiwan's iconic night-market fried snack</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Tomato Beef Brisket Noodle Soup</strong>（蕃茄牛腩麵）— slow-simmered beef brisket in tomato broth over noodles</span>
            </li>
          </ul>
          <p class="mb-3">Pricing: Lunch and dinner average <strong>CAD $20–30 per person</strong>, in line with the Richmond flagship.</p>
          <p class="mb-3">Service: Dine-in and takeout; walk-in waitlist (no online or phone reservations at this time, third-party delivery not actively promoted, no private events).</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">How Does It Compare to the Richmond Flagship?</h2>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="text-[15px] sm:text-[16px] mb-3">Same brand, same group. The differences come down to three things:</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Menu scope</strong>: Richmond carries the full menu; Coquitlam runs a curated soft-opening menu, and going forward the two menus won't be identical.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Hours</strong>: Coquitlam runs split lunch/dinner shifts daily (Sun–Thu 11:30 AM–3:00 PM and 4:00–10:00 PM; Fri–Sat dinner until 11:00 PM). Richmond runs continuously Mon–Thu and switches to split shifts on weekends.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Full group experience</strong>: Memory Corner's two sister brands — <a href="/en/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">Old Memory Kitchen</a> (Taiwanese-focused convenience store) and Sweet Memory (Taiwanese desserts and savoury midnight bites) — are both at 8080 Leslie Rd in Richmond. For the "restaurant + dessert + take-home frozen" three-stop run, you still need Richmond.</span>
              </li>
            </ul>
          </div>
          <p class="text-[14px] text-gray-600">Membership works across both locations — one account, cross-store points (CAD $1 = 10 pts; 1,600 pts = $10 off). See <a href="/en/news/membership-rewards" class="text-[#c59b63] hover:underline">Membership Rewards</a>.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Visit: Finding 345 North Rd</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="mb-1"><strong>📍 Address</strong>: 345 North Rd, Coquitlam, BC V3K 3V8</p>
            <p class="mb-1"><strong>🕒 Hours</strong>: Sun–Thu 11:30 AM – 3:00 PM, 4:00 PM – 10:00 PM; Fri & Sat 11:30 AM – 3:00 PM, 4:00 PM – 11:00 PM</p>
            <p class="mb-1"><strong>☎ Phone</strong>: (604) 917-0168</p>
            <p class="mt-3 text-[14px] text-gray-600">On North Rd, near the Coquitlam–Burnaby border. About 20 minutes by car from SFU Burnaby Mountain campus, and roughly 5 minutes from Lougheed Town Centre SkyTrain Station.</p>
          </div>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Who Should Come?</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Taiwanese-Canadian families in Coquitlam, Port Moody, Port Coquitlam</strong> — finally, you don't have to drive to Richmond for a Taiwanese dinner.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>SFU students</strong> — about 20 minutes off Burnaby Mountain; an easy group dinner option from the residences.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Early-adopter Taiwanese food fans</strong> — soft-opening windows are when guest feedback most directly shapes the menu's evolution.</span>
            </li>
          </ul>
        </section>
      `,
      faq: [
        {
          q: "Where is Memory Corner Coquitlam located?",
          a: "345 North Rd, Coquitlam, BC V3K 3V8 — on North Rd near the Coquitlam–Burnaby border. About 5 minutes by car from Lougheed Town Centre SkyTrain Station, and roughly 20 minutes from SFU Burnaby Mountain campus. Phone: (604) 917-0168.",
        },
        {
          q: "What does 'soft opening' mean? Will the menu expand later?",
          a: "Soft opening is the transition period before a full launch — the menu is curated and operations are still being refined. Memory Corner Coquitlam currently serves the headline signatures: Angelica Root Lamb Hot Pot, Taiwanese Three-Cup Chicken, Memory Corner Deep-Fried Popcorn Chicken, and Tomato Beef Brisket Noodle Soup. The menu will continue to develop based on soft-opening feedback and supply, and once finalized it won't be identical to Richmond's.",
        },
        {
          q: "How does it compare to the Richmond location?",
          a: "Same brand, same group, same headline dishes. Richmond carries the full menu and runs continuously Mon–Thu, with split lunch/dinner shifts on weekends. Coquitlam runs a curated soft-opening menu with split shifts daily (Sun–Thu dinner until 10:00 PM; Fri–Sat dinner until 11:00 PM). For the full comparison, see the Memory Corner Richmond article.",
        },
        {
          q: "What's the average price per person?",
          a: "In line with the Richmond flagship: lunch and dinner average CAD $20–30 per person, depending on what you order.",
        },
        {
          q: "Do I need a reservation?",
          a: "Memory Corner currently runs a walk-in waitlist; online and phone reservations are not available at this time. During soft opening, weekday afternoons and the late-afternoon slot tend to be easier to seat.",
        },
        {
          q: "Is it convenient from SFU or north Burnaby?",
          a: "Yes. About 20 minutes by car from SFU Burnaby Mountain, and roughly 5 minutes from Lougheed Town Centre SkyTrain Station. For diners in north Burnaby, Coquitlam, and Port Moody, this is now Memory Corner's closest location.",
        },
      ],
    },
  },

  /* ─────────────────────────────────────────────────────────────
     #1 上線前請補（業主專屬待辦）
     1) /public/images/news/authentic-taiwanese-restaurant-richmond.webp
        — 1:1 方形封面圖；建議 Richmond 店內裝潢或當歸羊肉鍋特寫。
     ───────────────────────────────────────────────────────────── */
  "authentic-taiwanese-restaurant-richmond": {
    "zh-TW": {
      title: "有香 Memory Corner Richmond｜正宗台菜・三代家族傳承",
      quick_answer:
        "有香 Memory Corner 是位於 Richmond 4651 Garden City Rd #1110 的台菜餐廳，傳承自 1975 年高雄吳家羊肉鍋的三代家族手藝。招牌菜包含當歸羊肉鍋、台式三杯雞、有香鹽酥雞、蕃茄牛腩麵；午晚餐人均約 CAD $20–30。提供內用與外帶、採 walk-in 候位制（目前未開放線上訂位）。Coquitlam 也有第二家試營運中的門市。",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">為什麼大溫已經有那麼多亞洲餐廳，還要有「有香」？</h2>
          <p class="mb-3">大溫的亞洲餐廳很多，但能讓你坐下來那一刻，感覺「回到家」的，不多。對有香（Memory Corner）來說，這份「家」不是裝潢上的選擇——而是一份信念：<strong>吃台灣菜，吃的不只是味道，是那份讓人想起家的人情味。</strong></p>
          <p class="mb-3">這份信念有起點。1975 年的高雄街角，吳爺爺為了改善家人的生活，毅然放棄高薪工作，開了一間小餐館。每天清晨他騎腳踏車跋涉數小時，向台灣傳統羊肉料理的師傅學藝——後來這成了高雄饕客都熟知的「吳家羊肉鍋」。手藝傳給吳爸爸後，又經歷了家族移民加拿大、原本餐館畫下句點的階段。</p>
          <p class="mb-3">成長於加拿大的吳家長孫，從小立志當廚師。多年磨練後，他決定讓家族味道在北美重生，創立第一家有香 Memory Corner——「有香」這個名字，<strong>來自爺爺與奶奶的名字</strong>，承載著對家族傳承最深的敬意。</p>
          <p class="text-[14px] text-gray-600">想看完整三代故事？<a href="/brand-story?tab=group" class="text-[#c59b63] hover:underline">前往集團品牌頁</a>。</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">我們怎麼把「人情味」做成可以被吃到的東西？</h2>
          <p class="mb-4">把「人情味」從一個字變成餐桌上的真實體驗，有香在三件事上下了功夫：</p>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">1. 把台灣街景搬進裝潢</h3>
            <figure class="my-4 -mx-1 sm:mx-0">
              <img src="/images/brand-story/DAV01968.webp" alt="有香 Memory Corner Richmond 店內：紅燈籠、台式廟宇龍柱、木桌長凳、台灣傳統招牌——把早期台灣街景搬進溫哥華餐桌" class="rounded-lg w-full h-auto border border-stone-200" loading="lazy" />
              <figcaption class="text-[13px] text-gray-500 mt-2 italic">紅燈籠串、廟宇龍柱、台式木桌長凳、八家將彩繪——有香 Richmond 店把早期台灣街景搬進大溫餐桌。</figcaption>
            </figure>
            <p class="text-[15px] sm:text-[16px]">走進有香，會發現這不是常見的「中式裝潢」——而是把台灣街角小吃店、夜市攤位的視覺氛圍，重新詮釋進空間裡。讓你還沒點菜，就先想起在台灣的某個午後。</p>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">2. 三代家族傳承的家常口味</h3>
            <p class="text-[15px] sm:text-[16px]">招牌「當歸羊肉鍋」是吳家羊肉鍋的直系血脈；其他菜色——台式三杯雞、有香鹽酥雞、蕃茄牛腩麵——同樣以家常烹法呈現，讓在北美生活的台灣人吃一口就知道是熟悉的味道。</p>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">3. 三品牌的一站式台味體驗</h3>
            <p class="text-[15px] sm:text-[16px] mb-2">有香 Memory Corner 是集團的核心，但不是全部。在 Richmond 8080 Leslie Rd 上，姊妹品牌<strong>憶點點 Sweet Memory（#130）</strong>與<strong>有香ㄟ灶腳 Old Memory Kitchen（#150）</strong>分別補上甜點宵夜與家用冷凍包這兩塊。會員制度三家共通——一個帳號、跨店累積（CAD $1 = 10 點，1,600 點折抵 $10）。</p>
            <p class="text-[14px] text-gray-600">延伸閱讀：<a href="/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">走進有香ㄟ灶腳</a>｜<a href="/news/membership-rewards" class="text-[#c59b63] hover:underline">會員回饋計畫</a></p>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">在有香實際上吃得到什麼？</h2>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3 mt-6">招牌菜（4 道）</h3>
          <figure class="my-4 -mx-1 sm:mx-0 max-w-md">
            <img src="/images/news/photos/lamb-hotpot.png" alt="當歸羊肉鍋 Angelica Root Lamb Hot Pot — 有香 Memory Corner 招牌料理，傳承自 1975 年高雄吳家羊肉鍋" class="rounded-lg w-full h-auto border border-stone-200 bg-white" loading="lazy" />
            <figcaption class="text-[13px] text-gray-500 mt-2 italic">當歸羊肉鍋——有香餐廳的招牌，1975 年高雄吳家羊肉鍋的延伸。</figcaption>
          </figure>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>當歸羊肉鍋（Angelica Root Lamb Hot Pot）</strong>—— 從 1975 年吳家羊肉鍋傳下來的核心料理，集團三代血脈所在。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>台式三杯雞（Taiwanese Three-Cup Chicken）</strong>—— 醬油、麻油、米酒三種液體燒煮的台灣家常經典。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>有香鹽酥雞（Memory Corner Deep-Fried Popcorn Chicken）</strong>—— 台灣夜市的代表炸物；於有香ㄟ灶腳也販售家用冷凍版。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>蕃茄牛腩麵（Tomato Beef Brisket Noodle Soup）</strong>—— 番茄熬湯、慢燉牛腩的湯麵，台菜路線中較少見的版本。</span>
            </li>
          </ul>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3">客單價</h3>
          <p class="mb-6">午餐與晚餐人均約 <strong>CAD $20–30</strong>，依點菜內容浮動。</p>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3">服務方式</h3>
          <ul class="space-y-2 mb-2">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>內用、外帶皆可</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>採 walk-in 候位制；目前未開放線上／電話訂位</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>第三方外送（Uber Eats / Skip / DoorDash 等）目前未主推</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>包場、私人活動：目前未開放</span>
            </li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">兩家門市：Richmond 與 Coquitlam</h2>
          <p class="mb-3">有香現有兩家門市：</p>
          <ul class="space-y-2 mb-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Richmond 旗艦店</strong>：4651 Garden City Rd #1110，提供完整菜單。週一至四 11:30 AM – 10:00 PM 連續營業、週五 11:30 AM – 11:00 PM；週六、日午晚餐分時段（午 11:30 AM – 2:45 PM；晚 4:00 PM–10:00 PM，週六晚至 11:00 PM）。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Coquitlam 店</strong>：345 North Rd，每日午晚餐分時段（週日至四 11:30 AM – 3:00 PM、4:00 PM – 10:00 PM；週五六晚至 11:00 PM）；<em>目前處於試營運期，菜色較為精選</em>。</span>
            </li>
          </ul>
          <p class="text-[14px] text-gray-600">主要熱門菜色（如當歸羊肉鍋、三杯雞、鹽酥雞、蕃茄牛腩麵）兩店共通；其他品項依各店供應為準。完整地址、電話、Google Maps 連結見文末「本文涉及門市」區。</p>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">配套體驗：飯後甜點與外帶補給</h2>
          <p class="mb-3">想把這頓飯變成完整的台味之旅？集團另外兩個品牌都在 Richmond 8080 Leslie Rd：</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>飯後想吃甜點？走進<strong>憶點點 Sweet Memory（#130）</strong>——台式甜點與古早味鹹食，週末從早午到凌晨 12:30 都營業。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>想把熟悉口味帶回家？<strong>有香ㄟ灶腳 Old Memory Kitchen（#150）</strong>有招牌菜的家用冷凍版（<a href="/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">完整介紹</a>）。</span>
            </li>
          </ul>
        </section>
      `,
      faq: [
        {
          q: "Memory Corner Richmond 在哪裡？要怎麼去？",
          a: "旗艦 Richmond 店位於 4651 Garden City Rd #1110, Richmond, BC V6X 2K4。距離 Richmond Brighouse SkyTrain 站開車約 8 分鐘，店面附近有共用停車場。電話 (604) 284-5434。",
        },
        {
          q: "需要訂位嗎？",
          a: "目前採 walk-in 候位制，到店登記 waiting list 即可，未開放線上或電話訂位。週末晚餐時段較滿，建議提早抵達。",
        },
        {
          q: "客單價大概多少？",
          a: "午餐與晚餐人均約 CAD $20–30，依點菜內容浮動。",
        },
        {
          q: "招牌菜推薦哪幾道？",
          a: "來自 1975 年吳家羊肉鍋傳承的當歸羊肉鍋、台式三杯雞、有香鹽酥雞、蕃茄牛腩麵都是熟客常點。第一次造訪建議從這四道開始。",
        },
        {
          q: "Memory Corner Richmond 與 Coquitlam 店有什麼不同？",
          a: "兩家屬於同一品牌與餐飲集團。Richmond 旗艦店位於 4651 Garden City Rd，提供完整菜單，週一至四連續營業、週末分時段。Coquitlam 店位於 345 North Rd，每日採午晚餐分時段營業（週日至四晚至 10 點、週五六晚至 11 點），目前處於試營運期，菜色較為精選；未來菜單與 Richmond 也不會完全相同——但主要熱門菜色（當歸羊肉鍋、台式三杯雞、有香鹽酥雞、蕃茄牛腩麵）兩店共通。第一次造訪建議以 Richmond 為主；若 Coquitlam 較近，也歡迎在試營運期間體驗。",
        },
        {
          q: "可以叫外送嗎？",
          a: "目前以內用與外帶為主，並未主推第三方外送平台。如有外送需求，請直接聯絡門市確認當下可選項。",
        },
      ],
    },
    en: {
      title: "Memory Corner Richmond: Authentic Taiwanese in BC",
      quick_answer:
        "Memory Corner (有香) is a Taiwanese restaurant at 4651 Garden City Rd #1110, Richmond, BC, carrying three generations of family recipes from a 1975 Kaohsiung lamb hot pot shop. Signature dishes include Angelica root lamb hot pot, Taiwanese three-cup chicken, deep-fried popcorn chicken, and tomato beef brisket noodle soup; lunch and dinner average CAD $20–30 per person. Dine-in and takeout, walk-in waitlist (no online or phone reservations). A second location in Coquitlam is currently in soft opening.",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Why Memory Corner — When Metro Vancouver Already Has So Many Asian Restaurants?</h2>
          <p class="mb-3">Metro Vancouver has plenty of Asian restaurants, but the ones that make you sit down and think "this feels like home" are rare. For Memory Corner (有香), that "home" feeling isn't a decor decision — it's a conviction: <strong>Taiwanese food is more than flavour. It's the warmth of family that the flavour reminds you of.</strong></p>
          <p class="mb-3">That conviction has a starting point. In 1975 Kaohsiung, Grandpa Wu walked away from a stable job to open a small lamb hot pot shop, riding his bicycle for hours every morning to study under traditional Taiwanese masters. The recipes became Wu's Lamb Hot Pot — a name local food lovers in Kaohsiung still remember. They passed to his son, then through the family's move to Canada, where the original shop closed but the flavours did not.</p>
          <p class="mb-3">Wu's grandson grew up in Canada with a chef's ambition. After years of training, he chose to bring those flavours back to North America, opening the first Memory Corner restaurant. <strong>The name "Memory Corner" (有香) comes from his grandparents</strong> — a tribute to three generations carried into one dining room.</p>
          <p class="text-[14px] text-gray-600">Read the full three-generation story on the <a href="/en/brand-story?tab=group" class="text-[#c59b63] hover:underline">group brand page</a>.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">How Do You Turn "Family Warmth" Into Something You Can Actually Taste?</h2>
          <p class="mb-4">Translating that warmth from a word into something at the table takes more than recipes. Memory Corner focuses on three things:</p>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">1. Taiwan's Street Scenes, Reframed</h3>
            <figure class="my-4 -mx-1 sm:mx-0">
              <img src="/images/brand-story/DAV01968.webp" alt="Memory Corner Richmond interior: red lanterns, temple-style dragon pillars, wooden tables and benches, Taiwanese signage — old Taiwan's street scenes brought to a Vancouver dining room" class="rounded-lg w-full h-auto border border-stone-200" loading="lazy" />
              <figcaption class="text-[13px] text-gray-500 mt-2 italic">Red paper lanterns, temple dragon pillars, wooden tables and long benches, painted ba-jia-jiang figures — the dining room at Memory Corner Richmond.</figcaption>
            </figure>
            <p class="text-[15px] sm:text-[16px]">Step inside Memory Corner and you'll notice this isn't the standard "Asian restaurant" look. The dining room recreates the streets of an earlier Taiwan — visual cues from old-era corner snack shops and night markets, reinterpreted for Richmond. You'll feel a little of old Taiwan before the menu arrives.</p>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">2. Three Generations in the Recipes</h3>
            <p class="text-[15px] sm:text-[16px]">The signature Angelica Root Lamb Hot Pot is a direct lineage from Grandpa Wu's 1975 shop. The other dishes — three-cup chicken, popcorn chicken, tomato beef brisket noodle soup — are home-style preparations, the kind a Taiwanese diner can recognize on the first bite.</p>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">3. A Three-Brand Taiwanese Stop</h3>
            <p class="text-[15px] sm:text-[16px] mb-2">Memory Corner is the group's anchor, but not its only piece. On Richmond's 8080 Leslie Rd, the sister brands <strong>Sweet Memory (#130)</strong> and <strong>Old Memory Kitchen (#150)</strong> add desserts, savoury midnight bites, and a Taiwanese-focused convenience store. One membership account works across all three (CAD $1 = 10 pts; 1,600 pts = $10 off).</p>
            <p class="text-[14px] text-gray-600">Further reading: <a href="/en/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">Inside Old Memory Kitchen</a>｜<a href="/en/news/membership-rewards" class="text-[#c59b63] hover:underline">Membership Rewards</a></p>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">What Do You Actually Order at Memory Corner?</h2>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3 mt-6">Signature Dishes (4)</h3>
          <figure class="my-4 -mx-1 sm:mx-0 max-w-md">
            <img src="/images/news/photos/lamb-hotpot.png" alt="Angelica Root Lamb Hot Pot at Memory Corner — the signature dish, carried from a 1975 Kaohsiung lamb hot pot shop" class="rounded-lg w-full h-auto border border-stone-200 bg-white" loading="lazy" />
            <figcaption class="text-[13px] text-gray-500 mt-2 italic">Angelica Root Lamb Hot Pot — the signature dish at Memory Corner, carried from the family's 1975 Kaohsiung shop.</figcaption>
          </figure>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Angelica Root Lamb Hot Pot（當歸羊肉鍋）</strong> — the core dish carried from Grandpa Wu's 1975 Kaohsiung shop, the lineage that defines the group.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Taiwanese Three-Cup Chicken（台式三杯雞）</strong> — soy sauce, sesame oil, rice wine in the classic three-cup home preparation.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Memory Corner Deep-Fried Popcorn Chicken（有香鹽酥雞）</strong> — Taiwan's iconic night-market fried snack; a home-edition frozen pack is also sold at Old Memory Kitchen.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Tomato Beef Brisket Noodle Soup（蕃茄牛腩麵）</strong> — slow-simmered beef brisket in a tomato broth over noodles; less common on Taiwanese menus elsewhere.</span>
            </li>
          </ul>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3">Pricing</h3>
          <p class="mb-6">Lunch and dinner average <strong>CAD $20–30 per person</strong>, depending on what you order.</p>

          <h3 class="text-lg font-bold text-[#3b2a1a] mb-3">Service</h3>
          <ul class="space-y-2 mb-2">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Dine-in and takeout</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Walk-in waitlist; online and phone reservations are not currently offered</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Third-party delivery (Uber Eats / Skip / DoorDash) is not actively promoted at this time</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Private events / buy-outs: not currently available</span>
            </li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Two Locations: Richmond and Coquitlam</h2>
          <p class="mb-3">Memory Corner has two locations:</p>
          <ul class="space-y-2 mb-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Richmond flagship</strong>: 4651 Garden City Rd #1110, full menu. Mon–Thu 11:30 AM – 10:00 PM continuous; Fri 11:30 AM – 11:00 PM; Sat & Sun split lunch/dinner shifts (lunch 11:30 AM – 2:45 PM; dinner 4:00 PM – 10:00 PM, until 11:00 PM Sat).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Coquitlam location</strong>: 345 North Rd, split lunch/dinner shifts daily (Sun–Thu 11:30 AM – 3:00 PM, 4:00 PM – 10:00 PM; Fri & Sat 11:30 AM – 3:00 PM, 4:00 PM – 11:00 PM); <em>currently in soft opening with a more curated menu</em>.</span>
            </li>
          </ul>
          <p class="text-[14px] text-gray-600">The headline signature dishes (Angelica Root Lamb Hot Pot, Three-Cup Chicken, Popcorn Chicken, Tomato Beef Brisket Noodle Soup) are available at both; other items vary by location. Full address, phone, and Google Maps links in the location panel below.</p>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">After-Dinner: Sweets and Frozen Take-Home</h2>
          <p class="mb-3">Want to extend the meal into a full Taiwanese run? The other two brands are at 8080 Leslie Rd in Richmond:</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>For dessert: <strong>Sweet Memory (#130)</strong> — Taiwanese desserts and old-school savoury bites; weekend hours run from brunch into the early hours.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>To take flavours home: <strong>Old Memory Kitchen (#150)</strong> stocks home-edition frozen packs of dishes you'll recognize from our restaurants (<a href="/en/news/taiwanese-convenience-store-vancouver" class="text-[#c59b63] hover:underline">full guide</a>).</span>
            </li>
          </ul>
        </section>
      `,
      faq: [
        {
          q: "Where is Memory Corner Richmond, and how do I get there?",
          a: "The Richmond flagship is at 4651 Garden City Rd #1110, Richmond, BC V6X 2K4. About 8 minutes by car from Richmond Brighouse SkyTrain Station, with shared parking nearby. Phone: (604) 284-5434.",
        },
        {
          q: "Do I need a reservation?",
          a: "Memory Corner currently runs a walk-in waitlist; online and phone reservations are not available at this time. Weekend dinner fills up — arriving early helps.",
        },
        {
          q: "What's the average price per person?",
          a: "Lunch and dinner average CAD $20–30 per person, depending on what you order.",
        },
        {
          q: "Which signature dishes do you recommend?",
          a: "First-time visitors typically start with the four classics: Angelica Root Lamb Hot Pot (carrying the 1975 family lineage), Taiwanese Three-Cup Chicken, Memory Corner Deep-Fried Popcorn Chicken, and Tomato Beef Brisket Noodle Soup.",
        },
        {
          q: "How are the Richmond and Coquitlam locations different?",
          a: "Same brand, same group. The Richmond flagship at 4651 Garden City Rd carries the full menu, running continuously Mon–Thu and switching to split shifts on weekends. The Coquitlam location at 345 North Rd runs split shifts daily (Sun–Thu dinner until 10:00 PM; Fri–Sat dinner until 11:00 PM) and is currently in soft opening with a more curated selection — and going forward the menus won't be identical between the two — but the headline signature dishes (Angelica Root Lamb Hot Pot, Taiwanese Three-Cup Chicken, Memory Corner Deep-Fried Popcorn Chicken, Tomato Beef Brisket Noodle Soup) are available at both. First-time visitors are best served at Richmond; if Coquitlam is closer, the soft-opening experience is also worth a try.",
        },
        {
          q: "Do you offer delivery?",
          a: "We focus on dine-in and takeout. Third-party delivery is not actively promoted at this time — please contact the location directly for current options.",
        },
      ],
    },
  },

  /* ─────────────────────────────────────────────────────────────
     #4 上線前請補（業主專屬待辦）
     1) /public/images/news/taiwanese-convenience-store-vancouver.webp
        — 1:1 方形封面圖，建議店面外觀或店內貨架特寫。
     2) 內文 [TBD] 黃底標記處：請填入 3–5 個真實商品舉例
        （台灣零食品名）。
     3) 是否提供素／全素品項？
     4) 是否支援線上訂購或第三方外送（Uber Eats / Skip）？
     ───────────────────────────────────────────────────────────── */
  "taiwanese-convenience-store-vancouver": {
    "zh-TW": {
      title: "走進有香ㄟ灶腳｜溫哥華台味便利店",
      quick_answer:
        "有香ㄟ灶腳（Old Memory Kitchen）位於 Richmond 8080 Leslie Rd #150，是大溫地區罕見以「台味」為單一定位的便利店——除了台灣進口零食，也販售台式三杯雞、蕃茄牛腩麵、胡椒餅、大腸麵線等冷凍料理包，把有香、憶點點熟悉的台灣家常味延伸到你家廚房。每日 10:00 AM–7:00 PM 營業，與姊妹品牌憶點點開在同一棟（#130），可一站採齊。",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">為什麼溫哥華需要一間「台式便利店」？</h2>
          <p class="mb-3">許多在大溫地區生活的台灣人都有類似的經驗：想吃某款熟悉的台灣零食，亞超有一整排日韓口味卻找不到那一款；想煮一桌家常台菜，食材買得到，但要從頭備料的時間總是不夠。</p>
          <p class="mb-3">有香ㄟ灶腳的角色，介於「亞超」與「台菜餐廳」之間——不是全品項雜貨店，而是把<strong>台灣家庭日常會出現的味道</strong>集中陳列：早餐桌上的醬料、午後的零嘴、忙碌晚上一個人也能加熱的料理包。</p>
          <blockquote class="border-l-4 border-[#c59b63] pl-4 italic text-gray-700 my-6 text-[15px] sm:text-[16px]">
            「不只是買東西的地方，更像是生活的一部分。」<br/>
            <span class="not-italic text-[13px] text-gray-500">— 有香ㄟ灶腳店面定位</span>
          </blockquote>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">走進店內：三個區塊</h2>
          <p class="mb-4 text-[15px] sm:text-[16px] text-gray-700">這也是有香ㄟ灶腳和一般亞超最不同的地方——除了零食，架上還有把<strong>有香、憶點點熟悉口味延伸到家中廚房</strong>的冷凍料理包，是大溫亞超少見的選擇。</p>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">1. 台灣進口零食</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">從台灣最受歡迎的常見品牌，到大溫不易買到的地方特色款，免空運、免代購。常備品項包含老農地瓜片、黑輪酥酥、香菇素脆酥這類經典台灣零食，每週依到貨情況輪替。</p>
            <figure class="my-3 -mx-1 sm:mx-0">
              <img src="/images/news/photos/imported-taiwanese-snacks.webp" alt="有香ㄟ灶腳常備台灣進口零食：老農地瓜片、黑輪酥酥、香菇素脆酥等" class="rounded-lg w-full h-auto border border-stone-200" loading="lazy" />
              <figcaption class="text-[13px] text-gray-500 mt-2 italic">店內常備的台灣進口零食一隅。</figcaption>
            </figure>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">2. 有香 招牌菜・家用冷凍版</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">把有香（Memory Corner）餐廳熟悉的招牌口味做成方便在家加熱的冷凍包，下班回家也能快速上桌：</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>有香鹽酥雞</strong>（Memory Corner Deep-Fried Crispy Popcorn Chicken）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>台式三杯雞</strong>（Taiwanese Three-Cup Stir-Fried Chicken）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>蕃茄牛腩麵</strong>（Noodle Soup with Tomato and Beef Brisket）</span>
              </li>
            </ul>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">3. 憶點點 經典・冷凍包</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">憶點點（Sweet Memory）的招牌古早味鹹食，同樣以冷凍包形式販售，在宵夜、早午餐、下班便當都能派上用場：</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>胡椒餅</strong>（Pepper Pork Pastry，4 入裝）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>大腸麵線</strong>（Taiwanese Vermicelli Soup with Pork Intestines）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>台式肉圓</strong>（Taiwanese Meatball Dumpling，4 入裝）</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">隔壁就是憶點點：一站式台味採買動線</h2>
          <p class="mb-3">有香ㄟ灶腳（#150）所在的 8080 Leslie Road 同時是姊妹店<strong>憶點點 Sweet Memory（#130）</strong>的所在地。兩家相鄰、同棟不同單位，定位互補：</p>
          <ul class="space-y-2 mb-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>憶點點</strong>：台式甜點與古早味鹹食，內用與外帶，營業到凌晨 12:30。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>有香ㄟ灶腳</strong>：販售型便利店，每日 10:00–19:00。</span>
            </li>
          </ul>
          <p class="mb-3">在憶點點吃晚飯或宵夜後，順手到有香ㄟ灶腳補貨，把當週的家常料理包帶回家——對住在 Richmond 的台僑家庭、UBC／SFU 的台灣留學生，是大溫少見的「一站式台味補給」動線。會員系統共用，同一帳號可跨店累積點數。</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">適合誰？什麼情境去？</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>想念台灣零食的留學生</strong>：免空運、免代購，週末走進去就買到熟悉的牌子。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>忙碌的雙薪家庭</strong>：用冷凍料理包補上「來不及煮」的那一頓。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>送禮給台灣親友的人</strong>：一次挑齊台灣味伴手禮。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>第一次接觸台灣口味的本地朋友</strong>：從零食開始，是低門檻的「台味入門」。</span>
            </li>
          </ul>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">怎麼來：地址與營業時間</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="mb-1"><strong>📍 地址</strong>：8080 Leslie Rd #150, Richmond, BC V6X 4A8</p>
            <p class="mb-1"><strong>🕒 營業時間</strong>：每日 10:00 AM – 7:00 PM</p>
            <p class="mb-1"><strong>☎ 電話</strong>：(778) 723-1685</p>
            <p class="mt-3 text-[14px] text-gray-600">店面前有共用停車位，距離 Richmond Brighouse SkyTrain 站約 10 分鐘車程。隔壁單位（#130）為姊妹店憶點點 Sweet Memory，可一併造訪。</p>
          </div>
        </section>
      `,
      faq: [
        {
          q: "有香ㄟ灶腳是一般亞超嗎？",
          a: "不是。亞超商品橫跨日、韓、中、東南亞，品項多但不專一。有香ㄟ灶腳專注於台灣進口零食、台式冷凍料理與料理包，是大溫地區罕見以「台味」為單一定位的便利店概念。",
        },
        {
          q: "有香ㄟ灶腳與隔壁的憶點點 Sweet Memory 是同一家店嗎？",
          a: "屬於同集團的姊妹品牌，位於同棟不同單位（憶點點 #130／有香ㄟ灶腳 #150）。憶點點專做台式甜點與古早味鹹食的內用與外帶，有香ㄟ灶腳則是販售型便利店。會員制度共用，同一帳號可在兩店累積與折抵點數。",
        },
        {
          q: "有香ㄟ灶腳在哪裡？",
          a: "地址是 Richmond, BC 的 8080 Leslie Rd #150，郵遞區號 V6X 4A8。距離 Richmond Brighouse SkyTrain 站約 10 分鐘車程，店面前有共用停車位。",
        },
        {
          q: "營業時間是？",
          a: "每日上午 10:00 至晚上 7:00 全年無休（特殊假期請以店內公告為準）。電話 (778) 723-1685。",
        },
        {
          q: "有香ㄟ灶腳和有香餐廳是不同概念嗎？",
          a: "是的，是兩種不同的台味體驗。有香（Memory Corner）是台菜餐廳，提供當歸羊肉鍋等內用料理；有香ㄟ灶腳是販售型便利店，除了台灣進口零食，也販售把有香、憶點點熟悉口味延伸到家中廚房的冷凍料理包，例如三杯雞、蕃茄牛腩麵、胡椒餅、大腸麵線。三家門市會員制度共通，可跨店累積點數。",
        },
      ],
    },
    en: {
      title: "Old Memory Kitchen: Taiwanese Convenience Store, Richmond",
      quick_answer:
        "Old Memory Kitchen (有香ㄟ灶腳) at 8080 Leslie Rd #150, Richmond, BC is a rare Taiwanese-focused convenience store in Metro Vancouver. Beyond Taiwan-imported snacks, it carries home-edition frozen packs — three-cup chicken, tomato beef brisket noodle soup, pepper pork pastry, vermicelli with pork intestines and more — bringing flavours you'll recognize from Memory Corner and Sweet Memory into your home kitchen. Open daily 10:00 AM–7:00 PM, sharing the building with Sweet Memory at unit #130.",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Why Vancouver Needs a Taiwanese Convenience Store</h2>
          <p class="mb-3">Anyone in Metro Vancouver looking for Taiwanese groceries knows the gap: Asian supermarkets stock plenty of Japanese and Korean snacks but rarely the specific Taiwanese brands you grew up with; Taiwanese restaurants serve the food but don't sell the pantry items behind it.</p>
          <p class="mb-3">Old Memory Kitchen sits between those two — not a full grocery store, but a curated shelf of <strong>the everyday flavours of a Taiwanese household</strong>: morning sauces, afternoon snacks, and frozen meals you can heat up after a long day.</p>
          <blockquote class="border-l-4 border-[#c59b63] pl-4 italic text-gray-700 my-6 text-[15px] sm:text-[16px]">
            "Not just a place to shop — more like a part of daily life."<br/>
            <span class="not-italic text-[13px] text-gray-500">— Old Memory Kitchen brand positioning</span>
          </blockquote>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Inside the Store: Three Sections</h2>
          <p class="mb-4 text-[15px] sm:text-[16px] text-gray-700">This is also where Old Memory Kitchen separates itself from a typical Asian grocery: alongside snacks, the freezer carries <strong>home-edition frozen packs of dishes you'll recognize from Memory Corner restaurant and Sweet Memory</strong> — a category most groceries in Metro Vancouver don't stock.</p>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">1. Taiwan-Imported Snacks</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">From household-name Taiwanese brands to regional finds rarely seen in Metro Vancouver — no shipping fees, no proxy buyers required. Regular stock includes Taiwanese sweet potato chips (老農地瓜片), crispy fish-cake snacks (黑輪酥酥), and seasoned shiitake crisps (香菇素脆酥), with weekly rotation based on freight.</p>
            <figure class="my-3 -mx-1 sm:mx-0">
              <img src="/images/news/photos/imported-taiwanese-snacks.webp" alt="A selection of Taiwanese imported snacks at Old Memory Kitchen Richmond — sweet potato chips, fish-cake crisps, shiitake snacks and more" class="rounded-lg w-full h-auto border border-stone-200" loading="lazy" />
              <figcaption class="text-[13px] text-gray-500 mt-2 italic">A snapshot of the Taiwan-imported snack selection.</figcaption>
            </figure>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">2. Memory Corner Signatures — Home-Edition Frozen</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">Crowd-favourite flavours from Memory Corner (有香) restaurant, packaged as home-edition frozen meals — heat at home for a familiar Taiwanese dinner:</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Memory Corner Deep-Fried Crispy Popcorn Chicken</strong>（有香鹽酥雞）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Taiwanese Three-Cup Stir-Fried Chicken</strong>（台式三杯雞）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Noodle Soup with Tomato and Beef Brisket</strong>（蕃茄牛腩麵）</span>
              </li>
            </ul>
          </div>

          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200">
            <h3 class="text-lg font-bold text-[#3b2a1a] mb-2">3. Sweet Memory Classics — Frozen Packs</h3>
            <p class="text-[15px] sm:text-[16px] mb-3">Sweet Memory (憶點點)'s old-school savoury favourites, also available as frozen packs — useful for late-night cravings, brunch, or weekday lunchboxes:</p>
            <ul class="space-y-2 text-[15px] sm:text-[16px]">
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Pepper Pork Pastry</strong>, 4 pcs（胡椒餅）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Taiwanese Vermicelli Soup with Pork Intestines</strong>（大腸麵線）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
                <span><strong>Taiwanese Meatball Dumpling</strong>, 4 pcs（台式肉圓）</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Sweet Memory Next Door: The One-Stop Taiwanese Run</h2>
          <p class="mb-3">Old Memory Kitchen (#150) shares 8080 Leslie Road with its sister brand <strong>Sweet Memory (#130)</strong>. The two are next-door neighbours in the same building, complementary in concept:</p>
          <ul class="space-y-2 mb-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Sweet Memory</strong>: Taiwanese desserts and old-school savoury snacks, dine-in and takeout, open until 12:30 AM.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Old Memory Kitchen</strong>: a retail convenience store, daily 10:00 AM – 7:00 PM.</span>
            </li>
          </ul>
          <p class="mb-3">Have dinner or a late-night bite at Sweet Memory, then pop next door to stock up on this week's meal packs. For Taiwanese-Canadian families in Richmond and UBC/SFU students from Taiwan, this is one of the few one-stop Taiwanese runs in Metro Vancouver. Membership is shared — one account earns and redeems points across both stores.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Who Is It For?</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Students missing Taiwanese snacks</strong> — no shipping fees, no proxy buyers; walk in and grab the brands you know.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Busy dual-income households</strong> — frozen packs covering the meals you don't have time to cook.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>People sending Taiwanese gifts home</strong> — pick up assorted Taiwanese flavours in one stop.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span><strong>Locals new to Taiwanese food</strong> — snacks are the low-stakes entry point.</span>
            </li>
          </ul>
        </section>

        <section class="mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Visit: Address & Hours</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="mb-1"><strong>📍 Address</strong>: 8080 Leslie Rd #150, Richmond, BC V6X 4A8</p>
            <p class="mb-1"><strong>🕒 Hours</strong>: Daily 10:00 AM – 7:00 PM</p>
            <p class="mb-1"><strong>☎ Phone</strong>: (778) 723-1685</p>
            <p class="mt-3 text-[14px] text-gray-600">Shared parking out front. Roughly 10 minutes by car from Richmond Brighouse SkyTrain Station. Sister brand Sweet Memory is right next door at unit #130 — visit both in one trip.</p>
          </div>
        </section>
      `,
      faq: [
        {
          q: "Is Old Memory Kitchen just a regular Asian grocery store?",
          a: "No. Asian supermarkets stock products spanning Japan, Korea, China, and Southeast Asia, with broad variety but no single focus. Old Memory Kitchen is purpose-built around Taiwan-imported snacks, frozen Taiwanese meals, and ready-to-heat packs — a rare single-cuisine convenience-store concept in Metro Vancouver.",
        },
        {
          q: "Is Old Memory Kitchen the same business as Sweet Memory next door?",
          a: "They are sister brands under the same group, located in the same building but separate units (Sweet Memory #130 / Old Memory Kitchen #150). Sweet Memory does dessert and savoury dine-in/takeout; Old Memory Kitchen is a retail convenience store. Membership is shared — one account earns and redeems points across both.",
        },
        {
          q: "Where is Old Memory Kitchen located?",
          a: "8080 Leslie Rd #150, Richmond, BC V6X 4A8. About 10 minutes by car from Richmond Brighouse SkyTrain Station, with shared parking out front.",
        },
        {
          q: "What are the hours?",
          a: "Open daily 10:00 AM – 7:00 PM (please check in-store notices for holiday adjustments). Phone: (778) 723-1685.",
        },
        {
          q: "How is Old Memory Kitchen different from the Memory Corner restaurant?",
          a: "They're two different ways to enjoy Taiwanese flavours. Memory Corner (有香) is a Taiwanese sit-down restaurant serving dishes such as Angelica root lamb hot pot. Old Memory Kitchen is a retail convenience store that, beyond Taiwan-imported snacks, carries home-edition frozen packs that bring flavours you'll recognize from Memory Corner and Sweet Memory into your home kitchen — three-cup chicken, tomato beef brisket noodle soup, pepper pork pastry, vermicelli soup with pork intestines, and more. All three locations share one membership system with cross-store points.",
        },
      ],
    },
  },
  "membership-rewards": {
    "zh-TW": {
      title: "會員回饋計畫｜消費就有回饋",
      quick_answer:
        "Memory Corner 三家門市（Richmond 有香、憶點點、有香ㄟ灶腳）共用同一套會員制度：消費 $1 累積 10 點，1,600 點即可折抵 $10。一個帳號跨店通用，從第一筆消費開始自動集點。",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">消費就有回饋</h2>
          <p class="mb-3">加入會員，從第一筆消費開始自動累積點數。</p>
          <p class="mb-3">
            無論是在 <strong>有香｜經典台灣料理</strong>，<br/>
            或是 <strong>憶點點｜療癒甜點與鹹食</strong>、<br/>
            <strong>有香ㄟ灶腳｜台味便利店</strong>，<br/>
            每一次用餐、每一筆購物，都是下一次優惠的開始。
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">點數累積與折抵方式</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="text-lg font-bold text-[#3b2a1a] mb-1">$1 消費 = 10 點</p>
            <p class="text-lg font-bold text-[#c59b63]">1,600 點 = 折抵 $10</p>
          </div>
          <p class="mb-3">
            點數可用於會員現金折抵，<br/>
            讓熟悉的台灣滋味，陪伴你的每一次日常。
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">會員注意事項</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>本會員回饋計畫適用於<strong>有香（Richmond）・憶點點・有香ㄟ灶腳</strong>三家門市。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>一個會員帳號可於上述三家門市累積與使用點數。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>點數僅適用於原價商品，恕不與其他折扣併用。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>點數累積部分項目可能有所限制，詳情請以店內公告為準。</span>
            </li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">以下項目不適用點數累積</h2>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>24 入飲品（含啤酒）</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>折扣商品</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>使用點數折抵之訂單或商品</span>
            </li>
          </ul>
        </section>

        <section class="mb-10 text-[15px] text-gray-500 leading-relaxed">
          <p class="mb-2">點數累積與折抵方式，依各門市與官網最新公告為主。</p>
          <p class="mb-2">部分活動、商品或時段，可能不適用點數累積或折抵。</p>
          <p class="mb-2">會員優惠內容將不定期更新，歡迎隨時留意最新公告。</p>
          <p>本公司保留會員制度與點數規則之最終解釋與調整權利。</p>
        </section>

        <section class="mb-6">
          <p class="text-[15px] text-gray-600">
            目前加入會員的步驟：<br/>
            <strong>有香（Richmond）＆ 憶點點 ＆ 有香ㄟ灶腳</strong> 三家適用
          </p>
        </section>
      `,
      faq: [
        {
          q: "Memory Corner 會員的點數可以在哪幾家門市使用？",
          a: "目前適用於 Richmond 三家門市：有香 Memory Corner（Garden City Rd #1110）、憶點點 Sweet Memory（Leslie Rd #130）、有香ㄟ灶腳 Old Memory Kitchen（Leslie Rd #150）。一個會員帳號可於三家門市同步累積與折抵點數。",
        },
        {
          q: "點數怎麼換算？",
          a: "消費 $1 累積 10 點，當點數達到 1,600 點時可折抵 $10。點數於消費當下即時入帳，從第一筆消費開始自動累積。",
        },
        {
          q: "哪些商品不能累積點數？",
          a: "24 入飲品（含啤酒）、已享有折扣的商品、以及使用點數折抵的訂單，均不適用點數累積。原價單品才會列入累計。",
        },
        {
          q: "如何加入 Memory Corner 會員？",
          a: "前往三家 Richmond 門市結帳時，依照店內指引完成註冊，即可立即開卡並從當筆消費開始集點。線上加入流程也即將開放。",
        },
        {
          q: "點數會過期嗎？",
          a: "會員點數效期請以結帳收據與店內最新公告為準。本公司保留會員制度與點數規則之最終解釋與調整權利。",
        },
      ],
      cta_text: "立即加入會員",
    },
    en: {
      title: "Membership Rewards | Earn Points on Every Purchase",
      quick_answer:
        "Memory Corner's three Richmond locations (Memory Corner, Sweet Memory, and Old Memory Kitchen) share one membership program: every $1 spent earns 10 points, and 1,600 points redeem for $10 off. One account works across all locations, starting with your first purchase.",
      content_html: `
        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Earn Rewards on Every Purchase</h2>
          <p class="mb-3">Join our membership and start earning points from your very first purchase.</p>
          <p class="mb-3">
            Whether you're dining at <strong>Memory Corner | Classic Taiwanese Cuisine</strong>,<br/>
            or visiting <strong>Sweet Memory | Sweet & Savoury Delights</strong>,<br/>
            <strong>Old Memory Kitchen | Taiwanese Convenience Store</strong>,<br/>
            every meal and every purchase brings you closer to your next reward.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">How Points Work</h2>
          <div class="bg-white/70 rounded-xl p-5 sm:p-6 border border-stone-200 mb-4">
            <p class="text-lg font-bold text-[#3b2a1a] mb-1">$1 spent = 10 points</p>
            <p class="text-lg font-bold text-[#c59b63]">1,600 points = $10 off</p>
          </div>
          <p class="mb-3">
            Redeem your points for cash discounts,<br/>
            and let the familiar taste of Taiwan be part of your everyday life.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Member Terms</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Valid at <strong>Memory Corner (Richmond), Sweet Memory, and Old Memory Kitchen</strong>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Earn and redeem points across all three locations with one account.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Points apply to regular-priced items only. Not valid with other offers.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-[#c59b63] shrink-0"></span>
              <span>Some items may be excluded. See in-store details.</span>
            </li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-[#3b2a1a]">Items Not Eligible for Points</h2>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>24-pack beverages (including beer)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>Discounted items</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#c59b63] font-bold">-</span>
              <span>Orders or items paid with point redemptions</span>
            </li>
          </ul>
        </section>

        <section class="mb-10 text-[15px] text-gray-500 leading-relaxed">
          <p class="mb-2">Points earning and redemption are subject to the latest announcements from each location and our website.</p>
          <p class="mb-2">Certain promotions, products, or time periods may not be eligible for points.</p>
          <p class="mb-2">Membership benefits may be updated from time to time. Please stay tuned for the latest announcements.</p>
          <p>The company reserves the right to interpret and modify the membership and points program.</p>
        </section>

        <section class="mb-6">
          <p class="text-[15px] text-gray-600">
            Membership registration is currently available at:<br/>
            <strong>Memory Corner (Richmond), Sweet Memory & Old Memory Kitchen</strong>
          </p>
        </section>
      `,
      faq: [
        {
          q: "Where can I use my Memory Corner membership points?",
          a: "Points are valid at all three Richmond locations: Memory Corner (4651 Garden City Rd #1110), Sweet Memory (8080 Leslie Rd #130), and Old Memory Kitchen (8080 Leslie Rd #150). A single account earns and redeems points seamlessly across all three.",
        },
        {
          q: "How do points convert to rewards?",
          a: "Every $1 spent earns 10 points, and 1,600 points redeem for $10 off. Points are credited at checkout and start accumulating from your very first purchase.",
        },
        {
          q: "Which items are excluded from earning points?",
          a: "24-pack beverages (including beer), already-discounted items, and orders paid with point redemptions are not eligible for point accumulation. Only regular-priced items qualify.",
        },
        {
          q: "How do I sign up for Memory Corner membership?",
          a: "Sign up in-store at any of our three Richmond locations during checkout. Your account is activated immediately and starts earning points on the same transaction. Online registration is coming soon.",
        },
        {
          q: "Do points expire?",
          a: "Point validity follows the latest in-store announcements and your receipt. Memory Corner reserves the right to interpret and adjust the membership and points program.",
        },
      ],
      cta_text: "Join Membership Now",
    },
  },
};

/* =================================================================
   UI 翻譯
   ================================================================= */
const UI = {
  "zh-TW": {
    home: "首頁",
    news: "品牌動態",
    quick_answer_label: "重點摘要",
    by: "撰文 / ",
    last_updated: "最後更新",
    faq_heading: "常見問題",
    visit_us_heading: "本文涉及門市",
    visit_us_subhead: "下方為 Memory Corner 集團 Richmond 與 Coquitlam 門市資訊。",
    address: "地址",
    phone: "電話",
    hours: "營業時間",
    map: "Google 地圖",
  },
  en: {
    home: "Home",
    news: "News",
    quick_answer_label: "Quick Answer",
    by: "By ",
    last_updated: "Last updated",
    faq_heading: "Frequently Asked Questions",
    visit_us_heading: "Locations Mentioned in This Article",
    visit_us_subhead:
      "Memory Corner Group locations across Richmond and Coquitlam, BC.",
    address: "Address",
    phone: "Phone",
    hours: "Hours",
    map: "Google Maps",
  },
};

const SITE_URL = "https://www.memorycorner8.com";

function formatDisplayDate(iso, locale) {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(locale === "en" ? "en-CA" : "zh-TW", {
      year: "numeric",
      month: locale === "en" ? "long" : "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/* =================================================================
   SSG
   ================================================================= */
export async function getStaticPaths() {
  const locales = ["zh-TW", "en"];
  const paths = [];
  ARTICLES.forEach((a) => {
    locales.forEach((locale) => {
      paths.push({ params: { slug: a.slug }, locale });
    });
  });
  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { notFound: true };

  const content =
    CONTENT[params.slug]?.[locale] || CONTENT[params.slug]?.["zh-TW"] || null;
  const ui = UI[locale] || UI["zh-TW"];
  const restaurants = getRestaurantsByIds(article.related_restaurants || []);
  const author = getAuthor(article.author_id);

  const jsonLd = buildArticleJsonLd({
    article,
    content,
    locale,
    restaurants,
    author,
    siteUrl: SITE_URL,
  });

  return {
    props: { article, content, ui, locale, restaurants, author, jsonLd },
  };
}

/* =================================================================
   頁面組件
   ================================================================= */
export default function NewsArticlePage({
  article,
  content,
  ui,
  locale,
  restaurants,
  author,
  jsonLd,
}) {
  if (!article || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#ede5d6]">
          <p className="text-xl text-gray-600">Article not found</p>
        </div>
      </Layout>
    );
  }

  const localePrefix = locale === "en" ? "/en" : "";
  const articleUrl = `${SITE_URL}${localePrefix}/news/${article.slug}`;
  const altZhUrl = `${SITE_URL}/news/${article.slug}`;
  const altEnUrl = `${SITE_URL}/en/news/${article.slug}`;
  const ogImage = `${SITE_URL}${article.img}`;
  const description = locale === "en" ? article.desc_en : article.desc_zh;
  const displayPublished = formatDisplayDate(article.date, locale);
  const displayModified = article.dateModified
    ? formatDisplayDate(article.dateModified, locale)
    : null;

  return (
    <Layout>
      <Head>
        <title>
          {[
            "Memory Corner",
            "Memory Kitchen",
            "Sweet Memory",
            "有香",
            "憶點點",
          ].some((b) => content.title.includes(b))
            ? content.title
            : `${content.title} | Memory Corner`}
        </title>
        <meta name="description" content={description} />
        <link rel="canonical" href={articleUrl} />
        <link rel="alternate" hrefLang="zh-Hant" href={altZhUrl} />
        <link rel="alternate" hrefLang="en" href={altEnUrl} />
        <link rel="alternate" hrefLang="x-default" href={altZhUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:locale"
          content={locale === "en" ? "en_CA" : "zh_TW"}
        />
        <meta property="article:published_time" content={article.date} />
        {article.dateModified && (
          <meta
            property="article:modified_time"
            content={article.dateModified}
          />
        )}
        <meta property="article:author" content={author.name} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="bg-[#ede5d6] min-h-screen">
        {/* 麵包屑 */}
        <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto px-5 pt-28 pb-4">
          <nav className="flex items-center text-sm text-gray-500 font-medium flex-wrap">
            <Link
              href="/"
              className="hover:text-black text-[16px] sm:text-[18px] transition-colors"
            >
              {ui.home}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              href="/news"
              className="hover:text-black text-[16px] sm:text-[18px] transition-colors"
            >
              {ui.news}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 text-[16px] sm:text-[18px] truncate max-w-[200px] md:max-w-none">
              {content.title}
            </span>
          </nav>
        </div>

        {/* Hero 圖片 */}
        <section className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto px-5">
          <div className="aspect-[1/1] relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={article.img}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* 標題 + 作者 byline + 日期 */}
        <section className="py-8 sm:py-10 px-5">
          <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#3b2a1a] leading-snug tracking-[0.02em]">
              {content.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-gray-600">
              <span>
                {ui.by}
                <span className="font-medium text-[#3b2a1a]">{author.name}</span>
                <span className="text-gray-500">
                  {" · "}
                  {locale === "en" ? author.role_en : author.role_zh}
                </span>
              </span>
              <span className="text-gray-400">|</span>
              <time dateTime={article.date}>{displayPublished}</time>
              {displayModified && displayModified !== displayPublished && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    {ui.last_updated}: {displayModified}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Quick Answer block — GEO 友好的直接回答 */}
        {content.quick_answer && (
          <section className="px-5 pb-2">
            <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto">
              <div className="article-quick-answer bg-[#f6efdf] border-l-4 border-[#c59b63] rounded-r-xl px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-[13px] uppercase tracking-[0.15em] font-semibold text-[#c59b63] mb-2">
                  {ui.quick_answer_label}
                </p>
                <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#3b2a1a]">
                  {content.quick_answer}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 文章內文 */}
        <section className="px-5 pt-6 pb-8">
          <div
            className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto text-[16px] sm:text-[17px] leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: content.content_html }}
          />
        </section>

        {/* CTA 按鈕：跳轉到 /app */}
        {content.cta_text && (
          <section className="px-5 pb-10">
            <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto text-center">
              <Link
                href="/app"
                className="inline-block bg-[#3b2a1a] hover:bg-[#4a3828] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 tracking-[0.06em]"
              >
                {content.cta_text}
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                {locale === "en"
                  ? "Follow the simple steps to start earning points"
                  : "依照步驟輕鬆加入，立即開始集點"}
              </p>
            </div>
          </section>
        )}

        {/* FAQ Accordion */}
        {Array.isArray(content.faq) && content.faq.length > 0 && (
          <section className="px-5 pb-12">
            <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-[#3b2a1a] mb-5">
                {ui.faq_heading}
              </h2>
              <div className="space-y-3">
                {content.faq.map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white/70 border border-stone-200 rounded-xl overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-3 font-semibold text-[#3b2a1a] text-[15px] sm:text-[16px]">
                      <span>{item.q}</span>
                      <span className="text-[#c59b63] text-2xl leading-none transition-transform group-open:rotate-45 select-none">
                        +
                      </span>
                    </summary>
                    <div className="article-faq-answer px-5 pb-5 pt-1 text-[15px] sm:text-[16px] leading-relaxed text-gray-700">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Restaurant entity stacking — 本地 SEO 與 GEO 信號 */}
        {Array.isArray(restaurants) && restaurants.length > 0 && (
          <section className="px-5 pb-20">
            <div className="max-w-[800px] xl:w-[60%] md:w-[70%] w-full mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-[#3b2a1a] mb-2">
                {ui.visit_us_heading}
              </h2>
              <p className="text-[14px] text-gray-600 mb-5">
                {ui.visit_us_subhead}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white/80 border border-stone-200 rounded-xl p-5"
                  >
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#3b2a1a] mb-3">
                      {locale === "en" ? r.name_en : r.name_zh}
                    </h3>
                    <dl className="text-[14px] sm:text-[15px] text-gray-700 space-y-2">
                      <div className="flex gap-2">
                        <dt className="text-gray-500 shrink-0 w-[60px]">
                          {ui.address}
                        </dt>
                        <dd>
                          {r.streetAddress}, {r.addressLocality},{" "}
                          {r.addressRegion} {r.postalCode}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-500 shrink-0 w-[60px]">
                          {ui.phone}
                        </dt>
                        <dd>
                          <a
                            href={`tel:${r.tel.replace(/[^\d+]/g, "")}`}
                            className="text-[#3b2a1a] hover:underline"
                          >
                            {r.tel}
                          </a>
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-500 shrink-0 w-[60px]">
                          {ui.hours}
                        </dt>
                        <dd className="whitespace-pre-line">{r.hours_human}</dd>
                      </div>
                    </dl>
                    <a
                      href={r.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-[14px] font-medium text-[#c59b63] hover:underline"
                    >
                      {ui.map} →
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
