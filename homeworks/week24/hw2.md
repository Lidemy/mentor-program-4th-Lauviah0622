## Redux middleware 是什麼？
可以想像成，在你的眼中，一樣是用 dispatch 發送東西，但真正傳給 reducer 的 action 是 middleware 發送的。為什麼要經過 middleware？主要是要處理非同步的問題。

![](https://imgur.com/mMgbTiw.jpg)

## CSR 跟 SSR 差在哪邊？為什麼我們需要 SSR？
CSR 是把很空的 HTML 傳給 client，然後 client 再透過 JS 加載內容和新增元素到 HTML 中。

SSR 則是在 server 就把內容塞好，然後就傳給 client，之後 client 有變動再透過 JS 依照變動去處理 DOM 的內容。

## React 提供了哪些原生的方法讓你實作 SSR？
ReactDOMServer 裡面有 renderToString() 來建立 html，建立好 html 之後要讓網頁能夠互動，就透過 react-dom package 的東西 hydrate() 上去。

hydrate 應該就像我們一開始的 addEventListener 這種感覺？這邊自己的理解是。SSR 應該是把 `React.createElement` 的行為拆解，原本會是

1. 建立 virtualDOM
2. 比較之後新增到 DOM 上面並加上 eventListener

renderToString 只把 html render 出來，但是並沒有幫 DOM 加上 event Listenr，所以要另外獨立一個步驟把初始的 element 加上 eventListener，後面才可以銜接上原本的 React 的執行。

不過應該還有一個步驟是要建立初始的 virturalDOM？ 不然只有 render plain html 會造成 virtaulDOM 和 DOM 不一致，或者可能 react 內部就已經有同步的方法了。

上面是自己的理解，不知道正不正確



## 承上，除了原生的方法，有哪些現成的框架或是工具提供了 SSR 的解決方案？至少寫出兩種

原本想用 react SSR 下去查，後來發現這個關鍵字好像內容不多，後來發現在 next 相關的文章都會提到 SSG （static site Generator）這個名詞，從這裡查到很多和 SSR 相關的 famework，還想說 SSG 是不是就是 SSR。然後看到[這篇](https://dev.to/jameesy/gatsby-vs-next-js-what-why-and-when-4al5)才發現說原來這是兩個不同的思路。

目前自己的理解，react 的 SSG 的思路有三種
- 一種是直接把內容 build 進去，所以只有在 build 的時候會 fetch 資料，這時候產出來的會是 static website，所以這不太算 SSR：例如 gatsby, react-static，目前好像比較多的套件似乎是從這個方向下手。  
Gatsby 有看到 min 助教的個人部落格有在用 XD

- 第二種是只把 html 還有 css build 出來給 Client，JS 後來才會加上去(hydrate)：例如 next.js
  
- 第三種是用 B server 去 request A server 原本的東西（原本的 server），B server 就會有 render 好的內容，然後 B server 再把 render 好的內容依照 request 回傳給真正的 client：例如 renderer.io





