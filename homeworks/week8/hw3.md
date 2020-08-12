## 什麼是 Ajax？
Asyncornous Javascript and XML，異步取得 JS 或者是 XML 資料的統稱。 

## 用 Ajax 與我們用表單送出資料的差別在哪？
1. Ajax 不會像 form 一樣給一個新的 url。就不用重新載入網頁，使用者體驗更好。
2. 可以自己設定 header。~~很自由，想怎麼設定就怎麼設定~~

## JSONP 是什麼？

瀏覽器的同源政策讓我們沒辦法輕易地使用非同源的 response，但是其實 [有些元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)是不受這個限制的。想想我們可以很自由的嵌入外界的圖片、 library 或者字體嗎？像是 `<img>`, `<script>`, `<img>`（原因可能這些東西本來就很常存取外部資源？），所以我們就可以利用這些 tag 來繞過瀏覽器的 CORS 接收非同源的 reponse。那要怎麼做呢？


如果 `index.html` 裡面有這麼一段程式碼，那會跑出什麼東西？

```
// index.html
<script>
    console.log({name: 'John', age: 14, birth: 1993});
</script>
```

當然就是在 console 裡面 print 出 `{name: 'John', age: 14, birth: 1993}` 這段內容，非常之直覺又簡單。那如果是這樣呢？

```
// index.html
<script src="cross-origin.com/jsonp.js">
```
```
// cross-origin.com/jsonp.js
console.log(`{name: 'John', age: 14, birth: 1993}`);
```

我們在 index.html 中引入 `cross-origin.com` 中的 `jsonp.js`，引入之後會執行 `console.log({name: 'John', age: 14, birth: 1993});` 。所以做的事情其實和上一段基本上是一樣的。唯一不一樣的是，我們 print 出來的內容是從另外一個網域拿到的，而且 `console.log()` 這個指令也是在引入的 `jsonp.js` 所呼叫的。

好，這樣就有點 JSONP 的味道出現了。接下來是重頭戲，下面這樣的程式碼會做甚麼事情？

```
// index.html
<script>
    function print(content) {
        console.log(content)
    }
</script>
<script src="cross-origin.com/jsonp.js">
```

```
// cross-origin.com/jsonp.js
print(`{name: 'John', age: 14, birth: 1993}`);
```

一樣是 print 出 `{name: 'John', age: 14, birth: 1993}` 沒錯。但是 jsonp.js 裡面所呼叫的 print 指令卻是是我們自己定義的 function。這個基本上就是 JSONP 運作的方式了，做了兩件事情：

1. 透過 `<script>` 引入外部 Server (另一個網域) 的程式碼
2. 外部 Server 的程式碼中**執行本地的處理資料的 function**，但在 function 中**放入外部的資料**。

JSONP 就是利用這樣的方式繞過瀏覽器的同源政策，不過我們也發現，整個 JSONP 的精髓都在那個引入的 js 檔案裏面的，要放入我們需要的資料，還需要執行我們本地的 function。

所以重點就變成：外部的 Server 要怎麼去產生執行的 function？也就是我們剛剛的：
```
// cross-origin.com/jsonp.js
print(`{name: 'John', age: 14, birth: 1993}`);
```
這點我們通常透過 url 來解決，可能是在後面放上本地中處理資料 function 的名子，像是這樣：

```
src="cross-origin.com/?jsonp=callback
```

當 url 設定成這樣，Server 就可以動態產生 js 檔案（也就是依照你的 url 後面的參數去量身訂做一個屬於你的 js 檔案，這對後端來說輕而易舉）。


最後，再舉個例子，我們看看 [Twitch API](https://dev.twitch.tv/docs/v5#json-and-jsonp)，除了使用 XHR 或 fetch，要怎麼用 JSONP 來獲取資料：

> All API endpoints support JSONP by providing a callback parameter with the request:
>
> curl -i https://api.twitch.tv/kraken?callback=foo

恩，就在 url 的後面加上 `callback=foo` ， `foo` 就帶入自己處理資料的 function 名稱。 url 寫好之後在放入 `<sciprt src=url>` tag 中就行。

話說，一開始看 docs 上面， web API 都會寫 curl ，都不知道那是啥，一點也不像 JS，不過後來才知道那只是用 curl 來做 request 的範例而已...

## 要如何存取跨網域的 API？
Response header 裡面的 `Access-Control-Allow-Origin` 必須要有包含原網域才可以。或者是更博愛的選項 `Access-Control-Allow-Origin: *` 。

## 為什麼我們在第四週時沒碰到跨網域的問題，這週卻碰到了？

Same-origin policy 同源政策是 Browser 的規定，但第四週都只是使用 node 或者是 curl 直接送出 request 而已，所以沒事兒。 