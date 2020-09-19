## 請簡單解釋什麼是 Single Page Application
不重新向 server get 新的 html，而是 server 拿資料，再利用操作 DOM 的方式來改變介面

## SPA 的優缺點為何
### pros
- SPA 因為不用重新解析整個 html 在 render 畫面，只要做部分 DOM 的更動就好，使用者體驗滑順到不行`.
- SPA 的 view 只要傳一次就好，後面就只要拿資料，server 流量小超多，可以幫公司省錢呢。

### cons
- 比起 MPA ，第一次載入要多很多 JS，所以會比較慢
- 如果 client 的裝置很爛會很痛苦，每個頁面都要跑很多 JS。
- 如果 client 禁用 JS 基本上網頁就掛了。
- 因為所有資料都要靠 ajax 拿，所以一開始的網頁就是一個空殼子，SEO 會很差（不過可以靠 SSR 解決，google 的爬蟲也會開始執行部分的 JS 了）

## 這週這種後端負責提供只輸出資料的 API，前端一律都用 Ajax 串接的寫法，跟之前透過 PHP 直接輸出內容的留言板有什麼不同？
`.php` 的檔案裡面只會有處理資料的部分，也看不到 `<element> </element>` 類似的東西，變得乾淨超級多。

之前的留言板幾乎沒有 html 檔案，因為都交由 php render 出來，JS 也比較簡單，甚至可能沒有，畢竟 php 都弄好了，如果要在傳遞資料給後端也基本上都用 `<form>` 或者是 `<a>` 提供的 API 就足夠。

不過用 SPA 的寫法之後 html 跟 JS 都開始複雜了起來，PHP 只負責資料的 CRUD ，不處理介面的東西，JS 開始要操作很多 DOM 的部分，甚至會需要在 Client 也放一份資料，等 client 做整理之後再傳回去 server，前端應該要加薪水吧！