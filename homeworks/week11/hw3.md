## 請說明雜湊跟加密的差別在哪裡，為什麼密碼要雜湊過後才存入資料庫

### 雜湊跟加密差在哪？
兩個都是用算法轉化原本的訊息變成另一個形式：

- 雜湊：將原文利用算法轉化成特定格式的訊息
- 加密：將原文利用算法以及密鑰轉化成密文

![](https://i.imgur.com/tHMO54h.png)

單從轉換的方式來看，加密要密鑰，雜湊不用密鑰。如果從對應來看：

- 雜湊：可以看成無限的集合對應到有限的集合（不過 hash 的算法好像會有最大長度？）
- 加密：原文與密碼的組合對應出密文是唯一的



### 為什麼密碼要雜湊過後才存入資料庫
做一個會員系統，最直覺的方法就是把會員的帳號跟密碼存起來，當要登入的時候，會員輸入帳號及密碼，我們再從 Database 裡面找找看有沒有對應的帳號密碼來認證。聽起來很直覺，但是如果發生了資料庫被盜取的情況，裡面的帳號密碼全部都被看光光，這就有問題了。

這時候可能會開始思考，要怎麼讓資料庫不被盜用，但是一個更好的方法是：「那我們就不要儲存密碼在資料庫，那就算被盜取也沒關係了」（剛開始聽到這樣的概念簡直是匪夷所思，太反直覺了），雜湊就可以讓我們不用存密碼也可以完成這個登入機制。

雜湊是用演算法**把任意的東西轉成特定的格式**，舉 `SHA1` 為例，可以最大264位元的訊息，轉換成一串 160 位元的訊息（可以稱之為"摘要"）。從上面的運算方式我們會知道雜湊有一個重要的特性：

> 不同的訊息有可能雜湊出來是同樣的摘要

為什麼這個特性很重要呢？

假設我們的會員機制存的不是密碼，而是將密碼雜湊過之後的摘要，當要認證會員的會員的時候也是比對帳號以及輸入的密碼的雜湊值。所以當一個駭客他偷到了一組帳號還有雜湊過的密碼，會像是這樣

```
username: lauviah0622
password: 70c881d4a26984ddce795f6f71817c9cf4480e79(原文是 aaaa)
```

這時候駭客知道說這一定是 hash 之後的密碼，但是也僅只如此，剛剛有提到，不同的訊息可能會雜湊出同樣的摘要，如果能夠反雜湊的話：

> 同樣的摘要反雜湊之後會出現多個訊息

所以即使駭客有辦法反雜湊回去（把摘要變回原文），那也會出現無限多種結果。

```
70c881d4a26984ddce795f6f71817c9cf4480e79 => aaaa 
70c881d4a26984ddce795f6f71817c9cf4480e79 => qewgjlmdwq 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 259sudkn3 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 1vpfsmp33aa 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 6081lknsfw 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 21ln13gds
70c881d4a26984ddce795f6f71817c9cf4480e79 => qweasdzcxc 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 215dsgs
...
```

因為會出現無限多種結果，所以駭客也沒辦法知道說到底哪個才是真的密碼，所以即使知道雜湊過的密碼也沒關係了。

真的是這樣嗎？

我們看看剛剛反雜湊的的結果


```
70c881d4a26984ddce795f6f71817c9cf4480e79 => aaaa 
70c881d4a26984ddce795f6f71817c9cf4480e79 => qewgjlmdwq 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 259sudkn3 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 1vpfsmp33aa 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 6081lknsfw 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 21ln13gds
70c881d4a26984ddce795f6f71817c9cf4480e79 => qweasdzcxc 
70c881d4a26984ddce795f6f71817c9cf4480e79 => 215dsgs
...
```

理論上駭客不可能知道這麼多密碼到底哪個是真的，但是密碼畢竟是人設的，所以通常會設定一些[好記的密碼](https://3c.ltn.com.tw/news/38914/#:~:text=%E6%8E%92%E5%90%8D%E5%89%8D%E4%B8%89%E5%90%8D%E5%AE%89%E5%85%A8,%E5%85%B1%E6%9C%89%E8%B6%85%E9%81%8E105%E8%90%AC%E7%AD%86%E3%80%82&text=%E5%8F%A6%EF%BC%8C%E6%AF%94%E8%BC%83%E7%89%B9%E5%88%A5%E4%B8%80%E6%8F%90,%E6%A6%9C%E6%8E%92%E5%90%8D%E7%AC%AC198%E5%90%8D%E3%80%82)，我們就可以先從一些看起來好記，簡單的密碼開始試，也是可以試出來。不過我們剛剛都建立在一個大重點上，也就是雜湊算法可以反編譯，但事實上雜湊的算法並沒有那麼容易反運算回去。

不過也有不反運算就可以猜出你密碼的方式，雖然雜湊可以將任意的密碼變成摘要，但是我們設密碼時通常也不會設太長，所以我們可以先把例如長度 10 以內所有排列的密碼都先算出來，然後再一一去比對，這種方法我們稱作 `Rainbow table 彩虹表`。

要對抗彩虹表最直接的方法就是把密碼設長一點，即使可以算長度 10 以內的密碼，但是如果長度再長上去，運算的速度就是幾何級數的增加，算出來可能要好幾千年。但是大部分可不會這麼幹，所以就要由我們工程師來幫使用者們加長之後再做雜湊，而這樣方式就稱作 `加鹽 salt`。



## `include`、`require`、`include_once`、`require_once` 的差別

先講有 _once 跟沒有的差別好了
- 有 _once： 沒辦法重複讀入，會被忽略。重複讀入檔案就可能造成 同樣的 function 名稱被重複命名，就會出問題。

include 跟 require 比較基本的差別則是，引入時遇到錯誤的時候會不會停止
- include：引入時遇到錯誤，像是沒有這個檔案之類的，不會停止，只會 print 出報錯訊息而已
- require：遇到錯誤會直接停止執行

從命名可以看出端倪，require 就是一個必須的感覺，所以一有問題就直接停止執行；include 的意思就是單純包含，沒有必要的意思在裡面，所以會繼續執行。

所以咱們課程每次都用 `require_once(utils.php)` 是有原因的。因為 utils 的東西是必須的，而且因為有 function 所以要避免到被引入多次的情形，所以才使用 `require_once`

## 請說明 SQL Injection 的攻擊原理以及防範方法
如果有人在 server 裡面用這麼樣的一段 code 去驗證登入正不正確
ex：
```js
var username = $_POST['username'];
var password = $_POST['password']
var sql = `SELECT * FROM users WHERE users.username = "${username}" AND password = "${password}"`;

if (SQLquery(sql).result.length > 0) {
    signIn()
};
```

所以基本上它就是用這段 SQL：`SELECT * FROM users WHERE username = "${username}" AND password = "${password}"` ，然後填入 usernae 跟 password 之後做 SQL query，最後檢查說這個有沒有符合的 row 來驗證有沒有符合的使用者。一切的一切都很正常，直到有一天有個壞傢伙在帳號打了這個東西 
```
username : "OR 1=1 #
password : whatever
```

打了這個之後我們來看看 query 的語法會變甚麼款
```
SELECT * FROM users WHERE username = ""OR 1=1 #" AND password = "whatever"
``` 
在 SQL 裡面， `#` 後面的東西都會被註解，所以我們的 SQL 語法變成了這樣

```
SELECT * FROM users WHERE username = ""OR 1=1
``` 

上面這段語法可以幹嘛？`WHERE username = "" or 1 = 1`，`1 = 1` 是一定的，所以會直接抓到全部的資料。駭客： 

> 計画通り

簡單來說 SQL injeection 就是一種駭客透過你的 SQL query 以及他的 Input 拼湊出你意想不到的指令來偷資料的方法。

### 防範

parameterized statement 參數畫查詢，原本這個方法是儲存語法以及需要搜索的路徑，來應對重複但不同關鍵字的的搜索，就不用重複的解析 SQL 語法以及重複搜尋路徑。因為搜尋的語句已經被固定了只會放入參數，所以剛好可以防範 SQL injection 攻擊，可喜可賀！
##  請說明 XSS 的攻擊原理以及防範方法
剛剛講過 SQL injection，原理是輸入奇怪的東西讓我們自己原本設定的語法執行非預期的指令。

XSS 也一樣，所以也可以算是一種 injection 吧，只是他的目標不是 SQL，是 html 語法。假設 server 端有這麼一個東西會放進使用者的留言：

```
<div>
    comment
</div>
```

沒想到好死不死有人在裡面放入 `<h1>123123</h1>`，整個就變成這樣：

```
<div>
    <h1>123123</h1>
</div>
```

痾，然後內容就跑出大標題了，想想 FB 留言突然有人字特別大。~~這一定是唐鳳腦波控制~~

防範方法也不複雜，HTML 有 escape 轉義符，你如果打 `&lt` 就會跑出 `<`，我們只要把 HTML 語法會碰到的符號 escape 掉就好了。php 可以用：`htmlspecialchars`，其實也可以自己寫啦，下面幾個替換就可以了。

```
& => &amp
< => &lt
> => &gt
" => &quot
' => &#039
```

## 請說明 CSRF 的攻擊原理以及防範方法

### CSRF 攻擊原理
詐騙領錢有兩種手法，一種是騙走你的提款卡跟密碼，然後叫車手領錢；另外一種方法，是假裝成綁架集團要求贖金，然後叫你匯到指定的帳戶。

CRSF 的原理有點像是第二種，駭客完全不知道你的帳號密碼，但還是可以盜走你的資訊，因為操作完全是你是你自己點的，就像剛剛第二種詐騙，是你自己匯款的。

拿這次的留言板來舉例好了，我們有一個東西叫做 handle_delete.php，我們會這樣用 `handle_delete.php?id=20` 來刪除指定的文章，不過當然不能隨便給人刪除，所以我們會檢查 session 裡面有沒有權限，或者是檢查有沒有登入帳號才可以做刪除。

但是如果有人這樣子呢？

![](https://i.imgur.com/Q5IgFyM.png)


年輕氣盛、血氣方剛的小明很可能當然會忍不住誘惑點下連結，而小明因為是自己點下的連結（就像被詐騙的人理所當然地知道自己的密碼），理所當然當然的 session id 就這樣驗證通過，server 也覺得毫無問題，就這樣，他辛辛苦苦打好的文章就被刪除了。

![](https://i.imgur.com/tTFxChK.png)

CSRF 是由攻擊者誘導使用者點擊連結，於是使用者就帶著自己的 session id 執行了攻擊者想要的操作，而 server 也驗證 session id 沒問題執行操作（畢竟 session id 的確是小明的沒錯）

### 如何防範 CSRF
要如何防範基本也就是解決導致可以使用 CSRF 的問題，可以先想想到底要滿足甚麼條件，才能夠成就一個成功的 CSRF 攻擊（就是上面的圖的箭頭還有最右邊的框框）：

1. 使用者要點連結（執行駭客誘導的操作）
2. browser 送出 cookie 中的 session id 給 server
3. server 只驗證 session id 後通過

想想怎麼解決這些要素就可以防範 CSRF 攻擊。

#### 針對使用者執行駭客誘導的操作
這個就是大家都說的不要亂點可疑 email 或者是 line 上面的訊息，不過只寫這個應該會被助教給砍了~~身為工程師的自尊在哪裡~~。

#### 針對 browser 送出 cookie 給 server
這裡我們可以怎麼做比較好？如果可以設定一些比較敏感的 cookie 只能從自己的網站發送 request 給自己的 server，這樣就沒問題了。

這個就是 set-cookie 裡面的 `samesite` 屬性，當你在設定 set-cookie 的時候可以設定說這個 cookie 只能在 domain 是甚麼樣的狀況下才可以跟著 request 送出。有兩種值可以設定。

```
Set-Cookie: session_id=token; SameSite=Strict
Set-Cookie: foo=bar; SameSite=Lax
```

strict 就只能在相同 Domain 的狀況， cookie 才會發出去，例如你在 google.com 的頁面上面有一個按鈕會發一個 ajax 到 google.com 的 server，這樣就會送出 cookie，但是如果你是在 yahoo.com 發 ajax 到 google.com 就不會送出 cookie。

Lax 的話會稍微寬鬆一點，可以在特定幾種常見的狀況也會送出 cookie，包含：`<a>`, `<link rel="prerender">`, `<form method="GET">`。如果從其他的地方連到網站也不怕沒有 cookie 可以用。

針對這個問題雖然現階段都是設定 cookie 的權限，不過可能以後會有新的方式讓 browser 端能有一個特別的方式來傳送比較敏感的 reqeust 狀態（？

#### 針對 server 只驗證 session id 後通過

這個就有很多操作空間了。

因為 session id 只能驗證身分，沒辦法驗證說是不是自己網站授權的操作。最簡單的方式就是驗證碼，除了 session id 還要檢查 server。

再來跟驗證碼很像的方法，也很直覺，假如我們要執行特定的操作要用 POST。那我們可以在 form 裡面加上隱藏的 token。這麼方法稱作 csrftoken（真直白）

```html
<form method="POST" action="delete">
    <input type="hidden" name="csrftoken" value="1241todkgnp13gf1">
    <input value="10" name="id">
    <input type="submit">
</form>
```

因為 token 是 server 生的，如果發現 request 裡面沒有對應的 token，就表示你是假的。看起來萬無一失，看來駭客們要失業了。

> 那我們把 token 盜走不就得了？

其實駭客可以自己登入一次，拿到 token 之後然後在 CSRF 的 request 中也加入 token，或者是用一些奇技淫巧去偷別人的 token（這邊目前想到的可以用 XSS 搜看看有沒有 token，用 selector 在配合 AJAX 就可以送到特定的 server ？；或者可以攔截 response 拿到 token 應該也是做得到）

而且每次都要存一個 token，這樣 google 不是一秒鐘就要存千萬個 token 了嗎？但是想想我們原本的目標：

- 確定 request 是來自己網站的授權

再來，我們還要處理一個問題：

- server 端不要存東西

---

這裡原本是想寫 double submit cookie  的東西，



```
set-cookie: csrftoken=29k5011j3845n1382g


```






