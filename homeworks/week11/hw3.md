## 請說明雜湊跟加密的差別在哪裡，為什麼密碼要雜湊過後才存入資料庫


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
因為 `1 = 1` 是 true，判斷變成 `WHERE username = "" OR 1=1` ，所以一定會登入

> 計画通り

### 防範

prepared statement
##  請說明 XSS 的攻擊原理以及防範方法


## 請說明 CSRF 的攻擊原理以及防範方法