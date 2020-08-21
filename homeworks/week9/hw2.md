## 資料庫欄位型態 VARCHAR 跟 TEXT 的差別是什麼
VARCHAR 可以規定長度，但是 TEXT 不行。
所以 VARCHAR 通常用在長度比較固定或者有限的狀況，可能暱稱、身份證字號之類的。

TEXT 就用在長度可能很大也可能很小，像是文章之類的狀況。


## Cookie 是什麼？在 HTTP 這一層要怎麼設定 Cookie，瀏覽器又是怎麼把 Cookie 帶去 Server 的？

Cookie 是 server 向 client 端發送，而由瀏覽器本身儲存的資料，而這個資料會在瀏覽器發送給 request 給 相同 domain 時一起夾帶出去發送給 server，server 就可以利用這些資料。而我們就可以利用這樣的機制給予 request 狀態。

當 server 向 client 發送 reaponse 的時，可以在 header 中設定：

```
setCookie: <key>=<value>;
```

如此一來瀏覽器收到 response 就會設置 cookie ，後面也可以加上過期時間，讓 cookie 在超過指定時間就會失效，要注意後面是**指定時間**，而不是經過多久，所以通常會在 server 用 `現在時間 + 希望過多久註銷 cookie`，的方式來設定。

```
setCookie: <key>=<value>;Expires=<date>;
```

瀏覽器會在相同 domain 的時候把發送 cookie 給 server，一樣也是夾帶在 request 的 header：

```
cookie: key=value; 
```


## 我們本週實作的會員系統，你能夠想到什麼潛在的問題嗎？

雖然不是會員系統，但如果再留言中留了 HTML 的程式碼，就會被解析成 HTML 執行

```JS
<script>console.log('123')</script>
```


