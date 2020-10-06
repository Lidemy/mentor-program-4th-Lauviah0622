## 什麼是 DNS？Google 有提供的公開的 DNS，對 Google 的好處以及對一般大眾的好處是什麼？

### 甚麼是 DNS
每一台伺服器的都有一個 IP 讓其他人連線，IP 就是一串很 nerdy 的東西 `3.184.233.123`。如果你要用 fb 要輸入 `4.231.133.544`、然後 google 要輸入 `3.555.123.123`，我的天，電話號碼已經夠難記了，還要記 IP。電話號碼我們可以設聯絡人，IP 我們也可以設置 Domain name。設定一一個我們人類可以理解的名稱，然後對應到我們的 IP 位置。 DNS 就是這樣的一套系統，當你輸入 `youtube.com` 的時候，先把這套 url 傳給 DNS server，DNS server (實際上會是多個 DNS server) 查找之後，他會傳給你 `youtube.com` 的 IP，讓你可以連線。

gTLG 擁有頂級域下面的域名，然後交給 domain name regieter 販賣或者是管理。然後我們買了 domain name 之後，透過 domain name register 設定 domain name 連線到 我們自已 server 的 IP 位置。

然後這一段沒有很清楚，我們透過 domain name register 設定的 domain name 是怎麼傳送給那些 DNS server 的？

### Google 有提供的公開的 DNS，對 Google 的好處以及對一般大眾的好處是什麼？
在 google 還沒有出現之前，有很多不同的 DNS server 我們可以連線，但是品質有點參差不齊，而且有一個更嚴重的問題是。如果我們輸入了對應不到 IP 的域名，那麼 DNS server 應該要顯示 NXDOMAIN（指說這個域名找不到 IP 的意思）。

BUT，這個頁面是個商機啊！廣告商看到巴士旁邊空空的，而且我們走在路上很容易看到，於是放上了廣告。發現小便斗前面空空的，而且我們在小解時一定會看到，於是放上了廣告。發現很多人常常打錯網址於是跑出 NXDOMAIN，而且我們一定會看到，那還不放上廣告？所以很多 DNS server 會把 NXDOMAIN 放入廣告來發財。

但是我們如果用 google 的 DNS server 就沒有這個問題了，會安心地把我們導到正確的 NXDOMAIN。還有 google 的 DNS server 也比其他的來的快，並保證不用戶的隱私性（畢竟 DNS server 知道你的 IP 跟拜訪的網站，就可以知道你的網路瀏覽紀錄）

#### 對 google 的好處？

應該是可以拿到使用者資料，雖然他們宣稱 24 小時內會刪除使用者個紀錄，但是 24 小時應該也可以處理很多事情？再來是可以優化他們的搜尋引擎，還有讓整個服務一體化確保服務品質。從搜尋引擎到 DNS 都是他們的人，所以你從搜尋開始就用 google 的服務，就可以從頭開始就體驗到 google 超快的服務，就不會想用其他慢吞吞的搜尋引擎了。甚至 google 可以做到讓搜尋引擎上面的連結直接是 IP（想起來好像是可行的）在搜尋引擎的階段就先幫你找好 IP，就不用再向 DNS request 一次了。

參考資料：
https://www.dnsknowledge.com/whatis/nxdomain-non-existent-domain-2/
https://aws.amazon.com/tw/route53/what-is-dns/#:~:text=%E6%8E%88%E6%AC%8ADNS%EF%BC%9A%E6%8E%88%E6%AC%8ADNS%20%E6%9C%8D%E5%8B%99,%E6%98%AF%E4%B8%80%E7%A8%AE%E6%8E%88%E6%AC%8ADNS%20%E7%B3%BB%E7%B5%B1%E3%80%82
https://zh.wikipedia.org/wiki/Google_Public_DNS

## 什麼是資料庫的 lock？為什麼我們需要 lock？
lock 就是鎖住資料欄位或者是整個 table 不讓別人修改。防止說兩個操作修改到同一個值，於是透過 lock 來處理 race condition 的問題。



## NoSQL 跟 SQL 的差別在哪裡？
儲存資料的方式不一樣，所以連帶的查詢的方式、新增資料的方式等等也不一樣。

SQL 就是用我們平常認知的表格去儲存資料的，所以就會先定義出欄位，然後在把資料放進去。但是因為要先定義出欄位，如果遇到變來變去、沒辦法先定義欄位的資料就難以處理了，簡單說就是缺乏彈性。

於是就有了 NoSQL，NoSQL 是 not only SQL 的意思（不只是 SQL），基本上只要 SQL 以外的儲存方式都會被稱為 noSQL，其實也有很多種類，像是：

- Key-value databases 
  用 key 還有 value 的方式來儲存資料，就像 JS 的 obejct 一樣。想存啥就存啥，非常隨和。這類型的我們就會稱作 Key-value Database，如果說你的 value 還有很多不同的data type，像是可以儲存成 array、object、string、number 等等，就會被稱為 document oriented database （會稱作為 docuemnt 是因為這些 database 會以一種文件格式作為基礎來儲存資料）
- Wide-column stores 
  原本的 SQL 欄位是固定的，每個一個 row 都要有同樣的 column，可是這樣很死板欸，突然要改就很麻煩。wide-column 的儲存方式很像原本的 SQL，但是並不是每個 row 都一定要有 table 中的每一個 column。（還沒有很清楚這個概念）
- Graph databases
  以圖為基礎的 database，我只知道這麼多了... 要了解可能要更深入了解資料結構的東西

實際上 NoSQL 跟 SQL 的語法也完全不同，我們看看一樣是 insert 的語法：
```
// MySQL
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);

// MongoDB
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)
```



參考資料：
[What is NoSQL?](https://www.mongodb.com/nosql-explained)
[document oriented database](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E6%96%87%E6%AA%94%E7%9A%84%E6%95%B8%E6%93%9A%E5%BA%AB)
## 資料庫的 ACID 是什麼？
操作資料庫裏面有一個很重要的東西叫做 transaction。簡單說，就是一連串必須一起進行的操作，例如：

> A 匯錢給 B，必須要執行兩個步驟
> 1. A.money -= 100
> 2. B.money += 100

如果 1. 沒有完成 2. 完成了，那麼整個銀行就會憑空多 100$。如果 1. 完成 2. 沒有完成，那麼整個銀行就會憑空少 100$。這麼嚴重的事情我們當然不能容忍（尤其是後者），所以再處理這種 transcation 的操作時我們必須要特別注意四點事項： ACID

> 所以 ACID 就是在 database 上面處理 transaction 要注意的事項，大概就像洗手要濕搓沖捧擦這樣的口訣

- Atomicity 原子性
  transaction 裡面的操作要馬全部成功，要馬全部失敗。這點蠻理所當然的，就像剛剛的舉例，如果 1. 成功 2. 不成功就會憑空多錢
- Consistency 一致性
  不同的數據都會有一些基本的約束，而這些約束在交易前跟交易後都必須要遵守，如果沒辦法遵守交易就必須失敗，聽起來很抽象，舉剛剛的匯款的舉例，匯款有一些基本的限制：
  1. 雙方的錢都不能小於 0
  2. 雙方錢的總和不能改變
  上面兩個限制在交易前跟交易後都必須要遵守，這就是一致性。
- Isolation 隔離性
  多個 transaction 不會互相干擾，不能修改到同一個值，例如
  > A 交易：小明 要匯給 小華 100：
  > 1. 小明.money -= 100
  > 2. 小華.money += 100
  > B 交易：小明 要匯錢給 阿雅 100
  > 1. 小明.money -= 100
  > 2. 阿雅.money += 100
  想像一下，如果 A 交易跟 B 交易同時進行。
  
  1. 執行 a.1 的操作，先看到小明有 500$
  2. b.1 也一起執行，也看到小明有 500$
  3. a.1 小明 -100$，然後幫小明標記為 400\$
  4. b.1 也幫小明 -100$，也幫小明標記為 400\$

  小明匯了兩筆錢，結果只扣到一筆的錢。所以 transation 在執行的時候必須要先把欄位鎖起來（不給操作），防止其他的操作也修改到同一個值。

- Durability 持久性
  這個最簡單了，在 transaction 成功之後，已經修改的數據不會不見


參考資料：
https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1