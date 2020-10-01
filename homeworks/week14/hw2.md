# 在 AWS 上面部署 LEMP server

LEMP 在這邊是指下面幾種技術的簡稱：  
- Linux
- Nginx
- MySQL
- PHP

我們會利用這些技術在 AWS 來做一個 web server，並把我們的資料部署到 server 上。我們可以先大概看一下我們做了哪些事情：

- 設定 AWS，其中包含
  - 建立一個 ubuntu 的 instance
  - 設定 security group
- nignx 比較快比較潮的 web server
  - 安裝 PHP 的 CGI
  - https
- mySQL 資料庫
  - 設定可以使用其他程式遠端連線
  - 建立一個帳戶，而且那帳戶只能存取他自己的 Database
- myphpadmin 方便線上操作資料庫，弄起來還是很方便的
  - 從瀏覽器登入 myPHPadmin 需要另外設定帳號密碼
- FTP server 用來上傳檔案
  - 建立帳號
  - 讓該帳號只能上傳東西到特定的資料夾裡面
  
這篇會站在巨人們的肩膀上，把蒐集到的資料做個統整，在最後會附上資料的連結。如果覺得我講的很模糊可以直接去看原文，後來覺得這篇文章的定位比較像是導讀的感覺，而且打到後面越來越x懶... 其實好像看參考的原文就好了（？）。
## AWS
AWS 是啥，Amazon Web Services 可以說是一個統稱，泛指 Amazon 旗下的網路服務，但是範圍非常之廣泛，包含很多不同種類的 VPS, Domain name 等等。可以讓你完全用他們的服務來組成一個完整且能附載高流量的 server。

這次要用的是 EC2 (Elastic Compute Cloud)，本質上他就是一個 VPS ，但優勢是可以自由地控制 VPS 的大小，即使建立之後要改配備的設定（核心數、RAM、硬碟大小）都沒問題，所以才會這麼夯。

### 建立 EC2 instance 

1. 要先辦 AWS 的帳號，然後選擇 EC2，這個就不帶了。
2. 到 instance 的視窗，然後點選 Launch instance

![](2020-09-23-11-01-16.png)

AWS 稱每個 VPS 叫做 instance 。另外，建立 instace 要透過所謂的 AMI（Amazon Machine Image），來安裝 OS 還有一些設定，簡單說就像一個模板，所以等你很強你也可以做自己的模板，但現在先不要。

可以先點 Filter Tier only，就可以看到免費的 template

上面還可以選國家，聽說可以選近一點的連線比較快，自己沒有實驗過。
在這邊自己是選 `Ubuntu Server 18.04 LTS (HVM), SSD Volume Type` 

選 Ubuntu 是因為感覺比較熟悉，版本選舊而不選 20 的是覺得說資源可能比較多，然後後面那個  SSD Volume Type 的意思沒有很了解，不過看 [docs](https://aws.amazon.com/tw/about-aws/whats-new/2014/06/16/introducing-the-amazon-ebs-general-purpose-ssd-volume-type/#:~:text=Introducing%20the%20Amazon%20EBS%20General%20Purpose%20(SSD)%20volume%20type,-Posted%20On%3A%20Jun&text=Backed%20by%20Solid%2DState%20Drives,baseline%20of%203%20IOPS%2FGB.) 應該是指說 vps 會使用 SSD，讀寫會比較快？但是疑惑的點是會從安裝 os 這邊來選嗎？所以自己也沒有很清楚。大家可以自己看狀況，其實進去之後 OS 操作應該是大同小異。記得選免費的就好

3. 選規格

![](2020-09-23-11-11-34.png)

其實我們也只能選免費的。這裡的規格大致上是指說我們會分到幾顆 CPU、記憶體的容量等等。有點像在選電腦的感覺。

除此之外有一些細部規格，不過看不太懂而且用免費的也不用想太多，這邊就先 next。

4. Security Group
 
![](2020-09-23-11-15-39.png)

這個但是事後也可以再設定，之後會再提到。

弄完之後會讓你看一下大概的規格，OK 就可以 launch instance （啟動你的 server）了

5. 設定 private key

![](2020-09-23-11-19-10.png)  

因為跟 AWS 連線是使用 SSL 連線，需要 public key 跟 private key，所以他會問你說要建立新的 key，還是用之前設定好的。因為從來沒用過，所以當然是選擇 new key，就照上面的要求打上名子然後 download 下來放到你的~~寶貝袋~~資料夾裡面，之後 SSH 連線都會用到。

到這裡就成功了

### 設定 security group

security group （後面簡稱SG） 可以設定允許透過哪些 port 可以傳入資料（稱作 inbound），還有透過哪些 port 可以傳出資料（稱作 outbound）。但大部分是只會設定 inbound 而已，因為傳出跟安全性比較沒有關係（就目前自己的了解）。預設是開啟 `:22` 也就是 ssh 連線的預設 port，如果沒有開這個你就沒辦法連到你的 server 了（還有其他方式可以連到 server 啦，不過這裡先用 ssh）。

我們可以建立很多不同的 SG，然後依照狀況套用進去。接下來的步驟就是要建立一個 SG，然後開啟我們需要的服務會用到的端口，分別是：

- HTTP: `80` ipv4
- HTTPS: `443` ipv4
- FTP: `20-21` ipv4 & ipv6, `900`,  `40000-50000`
- MySQL: `3306` ipv4


為什麼會開這些 port？每個服務都有一個預設的 port，上面這些就是需要的功能的 port，FTP 的部分就比較奇怪，可以之後在了解。那接下來會講怎麼新增 SG。

1. 點擊 SG 然後 add rule
2. SG 的基本設定
![](2020-09-23-13-55-10.png)
 SGname 隨便填，你喜歡就好。descroption 也是建議可以打個容易識別的名子。VPC (Virtual Private Cloud)，簡單來說就是一個屬於你的虛擬 IP 位置這樣，這個東西用預設的就好了。（這個東西自己也沒有很清楚）

<details><summary>❓ VPC是甚麼？</summary>
自己目前對於 VPC 的理解是，Amazon 只有寥寥幾個 ipv4 的 IP，不可能所有人一人一個，但是他有無數個虛擬。所以他會透過類似 router 的東西，當有人向 寥寥幾個 IP 傳送 Request 時候，用 router 把 request 指向虛擬 IP。不過有一個問題是說他怎麼知道那個原本的 IP 要 router 去哪裡？這個東西關係到網路的東西有點小複雜阿...
</details>  
<br>

3. add rule

![](2020-09-23-14-19-33.png)
點擊 add rule，然後其實他會有一些預設的 set，可以直接選擇，我們需要設定的東西是 Source，能夠設定說允許哪些 IP 位置能夠連線進來。因為我們是 web server，要讓世界各地的人來看我們的網站，所以這裡就不限制，點三角形有一個 anywhere 的選項，全部都設置為 anywhere。

其實 anywhere 就是設置 ipv4 是 0.0.0.0/0 跟 ipv6 

<details><summary>❓ CIDR</summary>
這裡的標示方法是用 CIDR 表示法，不過 CIDR 是啥，還有子網路遮罩又是啥，這裡還有很多坑要填。直接講說 CIDR 是什麼可能要從 IP 是甚麼開始寫了，直接寫說這樣寫代表的意義是甚麼好了。  
  
這裡的用 CIDR 的原因是指定 NET_ID，然後允許下面所有的 HOST 可以連線，像是 132.2.123.222/8 就表示說 可以從 132.0.0.0 ~ 132.256.256.256 都可以連線

不過這裡有問題是說，所以 132.3.123.222/8 跟 132.23.232.222/8 這兩個是一樣的？因為前面的 132 都是相同的
</details>
<br>

這樣就設定好 SG 了，設定的部分再細節部分可能有點因人而異，不過大方向就是把需要的 port 打開，然後不限制 IP 進來就對了。

4. 更改 instance 的 SG

回到 instance，選擇自己的 instance 之後點擊 action > networking > change security group ，然後選則剛剛設定的 SG`，然後按 add。一定要做這步不然沒用喔，還是會連不上去。

### 用 ssh 登入 VPS

打開你的 CLI，用哪個都行，有 ssh 就可以。然後輸入
```
格式：
ssh -i "你的剛剛下載的 key 的位置" ubuntu@"你 insatnce 的 Public IP address"
範例：
ssh -i ./location.pem ubuntu@3.232.232.232
```
會問你 yes 還是 no，不太懂這邊問這個是甚麼意思，不過選 yes 就可以了（就是這種心態才會出問題）

可以稍微來看一下上面的 command 的意思，`-i` 的意思是使用檔案的金鑰認證，後面是 `用戶名稱@IP位置`，要輸入 Public IP DNS 也是可以啦，如果之後有串上自己的 DNS 也可以使用。

或者是可以點進去你的 instance 然後按裡面的 connect > ssh client 就會有教學，複製上去 CLI 就可以了

![](2020-09-23-16-07-30.png)


到這裡就正式把 VPS 設定好了。

## 安裝 nginx, Mysql, PHP

處理完 instance 就到了安裝的環節了，這裡基本上是參考[這篇文章](
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04)

對了，安裝之前，因為讀者可能會找其他的資料（這篇寫的不夠清楚時），要記得盡量找  OS 版本符合的，我們安裝的 OS 是 Ubuntu 18.04。

首先先更新一下系統：
```
sudo apt update && sudo apt upgrade && sudo apt dist-upgrade
```

只要安裝 Package 完他都會問你說（後面也會出現）
```
After this operation, 312 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

問你會占用多少容量，要不要安裝，按 yes 就可以了，哪次不 yes。  

### 安裝 Ngnix

```
sudo apt install nginx
```

稍微解析一下指令在幹嘛， `sudo` 是以管理員的身分執行的意思，`apt` 則是 Ubuntu 管理套件的工具，之後可能會看到 `apt-get` ，其實是一樣的東西，只是 `apt` 把常用的東西抽出來，有點像瑞士刀的感覺，詳細可以看[這篇](https://www.itread01.com/content/1543804995.html#:~:text=apt%E8%88%87apt%2Dget%E4%B9%8B%E9%96%93%E7%9A%84%E5%8D%80%E5%88%A5&text=apt%20%E5%85%B7%E6%9C%89%E6%9B%B4%E7%B2%BE%E6%B8%9B,%E7%B5%84%E7%B9%94%E6%96%B9%E5%BC%8F%E6%9B%B4%E7%82%BA%E6%9C%89%E6%95%88%E3%80%82&text=%E4%BE%8B%E5%A6%82%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%9C%A8%E4%BD%BF%E7%94%A8%20apt,get%20%E6%99%82%E7%9B%B8%E5%90%8C%E7%9A%84%E6%93%8D%E4%BD%9C%E3%80%82)，後面就不贅述了，就是下載的 nginx。

這個階段設定好之後，就可以透過 `http://[你的 public IP]` 來連線了，AWS 的 Public IP 可以在 Instance 的資料裡面看到。會顯示 nginx 的預設畫面，這個畫面的資料會被放在 `var/www/html` 裡面，這也是之後我們會放我們東西的地方。


### 設定防火牆

自己這部分沒有設定，有興趣可以看原教學。

防火牆可以阻擋未經我們允許的連線，來讓 server 更安全，防火牆可以在網路的每一個環節的很多部分去做，像是在路由器、IPS（像是種花電信），我們剛剛設定的 SG 也是防火牆之一。

因為 aws 的 Security Group 就已經阻擋未開啟的 port 連線 server 的功能了，所以 SG 還有 ufw 的設定功能上是重疊的，詳細可以看[這篇](https://serverfault.com/questions/286665/why-have-both-security-groups-and-iptables-on-amazon-ec2)。不過並不是說當你使用 aws，ufw 就完全不用了，ufw 可以做到針對傳遞的內容或者是流量阻擋等等更細節的操作，可以用來防止 DDOS 之類的攻擊。

> 通常在講設定防火牆，其他文章會提到的大多是 ufw（Uncomplicated FireWall），1不過實際上 ufw 背後也是去設定 iptable（可以看[這篇](https://askubuntu.com/questions/952705/ufw-or-iptables-on-ubuntu-for-openvpn)），但是因為 iptable 太複雜了，而且 ubuntu 也已經內建 ufw （ubuntu 18.04），所以大家都用 ufw 去設定。


### 安裝及設定 mySQL server

資料庫的部分我們使用 MYsql，先進行下載。

```
sudo apt install mysql-server
```

```
sudo mysql_secure_installation
```

接來我們會啟用 mysql-server 的 Validate Password Plugin。後面就不付上指令了，建議自己稍微看一下內容會比較好，能夠理解自己在幹嘛。


Validate Password Plugin 會強制你的密碼要有一定限制，繼續剛剛的步驟就可以看到有三種規則，看你自己的要求，不過之後 phpmyadmin 還有我們要用遠端連線資料庫的密碼也要遵守這個規則，可以自行斟酌。

接著會開始設定 root 帳號的密碼， root 帳號是 mySQL 裡面最高權限的帳號，我們在操作資料庫其實不太會直接用這個帳號操作，如果不小心誤操作會造成嚴重的問題。

設定好密碼之後還有一件事情要做，在 mysql 裡面，root 的預設登入帳號是使用 `auth_socket`，會直接對已經登入的 linux 帳戶作驗證，就不用另外打 mysql 帳戶的密碼。這裡我們要改一下設定：

```
sudo mysql
```

進入 mysql，使用 mysql 的 CLI。

```
SELECT user,authentication_string,plugin,host FROM mysql.user;
```

我們先來看看原本的登入方法還有用戶資料

```
+------------------+-------------------------------------------+-----------------------+-----------+
| user             | authentication_string                     | plugin                | host      |
+------------------+-------------------------------------------+-----------------------+-----------+
| root             |                                           | auth_socket           | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian-sys-maint | *CC744277A401A7D25BE1CA89AFF17BF607F876FF | mysql_native_password | localhost |
+------------------+-------------------------------------------+-----------------------+-----------+
4 rows in set (0.00 sec)
```

可以看到 mysql 在安裝的時候就已經會有預設一些帳戶了。而且 root 在 plugin 是  `auth_socket`，我們要改成 `mysql_native_password` 來用 mysql 設定的密碼登入。

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

指令蠻直觀的，可以看一下內容，就是指定用戶以甚麼樣的方式登入，最後要輸入剛剛設定的密碼。

> 有看到說可以用另外一個指令來設定
> ```
> UPDATE user SET plugin='mysql_native_password' WHERE User='root';
> ```
> 似乎一個是用 mysql 處理帳戶的方式來設定，另外一個就是單純用 UPDATE 的指令來設定身分的 table，而且只改變 plugin。不知道說這兩個有沒有什麼差別。

```
FLUSH PRIVILEGES;
```

這個指令是更新權限表，每次修改權限都需要更新才會套用設定。

剛剛在修改權限時有看到 `'root'@'localhost'`，這是什麼？我們知道說 `root` 是我們最高權限的帳號，那 `localhost` 呢？

SQL 的權限設定是用 `帳號名稱@登入位置` 來設定的，跟我們一開始登入 ssh 的概念有點像，這兩個合在一起才可以組成完整的登入帳號。所以  `'root'@'localhost'` 表示在 **localhost** 上面登入的 **root**，如果你要從外部（例如不透過 ssh，用程式來遠端連線）連線到 SQLserver 用 root 帳號登入是行不通的，只提供從 `localhost` 連線。也可以設定不管從哪裡連線都可以，後面如果填入 `'%'` 表示不管從哪裡連線都可以（不確定可不可以填入域名）。

SQL 還可以設定從不同的地方連線同一個帳戶可以有不同的權限。之後在處理 PHPmyadmin 的時候會提到。

設定完之後可以在輸入前面 `SELECT` 的指令看看自己的設定有沒有生效。 OK 就可以

```
exit
```

離開 mysql。設定好之後可能就沒辦法用 `sudo mysql` 來登入了，會需要使用

```
mysql -u root -p
```

然後輸入密碼登入。

> 也有看到使用 `sudo mysql -u root mysql` ，這裡自己沒有詳細研究之間的差別。

### PHP

再來就是 LEMP 的最後一個步驟：PHP。這步驟我們要處理 PHP 的 CGI。什麼是 CGI？ CGI (Common Gateway Interface) 會把接收到的 request 轉化成語言可以解讀的形式，然後再用程式的語法送出 response。所以你才可以用 `$GET`, `$POST` 之類的東西來處理 request，然後 `echo` 就可以送出 response 的 body。

我們這裡就是要設定 PHP 的 CGI，更準確地來說是 FastCGI，也就是 CGI 的進化版。你也可以自己設定你喜歡的，像是另外一個 P（python），或者是 Ruby 之類的（LEMR 聽起來好像比 LEMP 更酷）。

```
sudo apt install php-fpm php-mysql
```

> 有可能會沒辦法下載(自己有遇到這個問題)，會需要先下載 universe 的 repo
> ``` 
> sudo add-apt-repository universe
> ```

這樣就下載好 php-fpm （PHP FastCGI Process Manager），我們必須手動把 CGI 串上 web server，也就是 nginx。需要手動修改 nginx 的設定檔。

這裡講一下 nginx 設定檔的結構：

nginx 有一個主設定檔 `nginx.conf` 位在 `etc/nginx/` 裡面，裡面有這一段

```
http {
      //...
      include /etc/nginx/conf.d/*.conf;
      include /etc/nginx/sites-enabled/*;
}
```

會引入 `/etc/nginx/conf.d/*.conf` 還有 `/etc/nginx/sites-enabled/*`。通常對個別網站的做法是會在 `/etc/nginx/sites-available/` 裡面寫我們個別網站的設定，然後在透過連結的方式把需要的設定連結到 `sites-enabled` 裡面。個別網域的東西比較不會去動主設定檔。接下來就開始處理：

```
sudo nano /etc/nginx/sites-available/example.com
```

開一個 `example.com` 讓我們寫設定檔，名子隨便你，文字編輯器也隨便你，參考文章裡面的 `nano` 就只是一個文字編輯器而已。

```
server {
        listen 80;
        root /var/www/html;
        index index.php index.html index.htm index.nginx-debian.html;
        server_name example.com;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }
}
```

然後把檔案改成這樣。你也可以直接 cp (複製的指令) `sites-available` 裡面的 default，在修改檔案

```
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/example.com
```

然後要加的東西加一加，其實 `default` 裡面都幫你打好了，弄到上面那樣就可以了。

```
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
```
```
sudo systemctl reload nginx
```


接下來就是做剛剛說到的設定連結到 `sites-enabled` 裡面，而且把 default unlink，最後更新 nginx 的設定。

在更新之前也可以用 `sudo nginx -t` 來測試看看說設定有沒有打錯。這樣就設定好 PHP 的 CGI 了。

### 測試

最後我們來測試一下

```
sudo nano /var/www/html/info.php
```

```
<?php
phpinfo();
```

建立一個 info.php，輸入上面的指令。這個 PHP 指令可以告訴我們 PHP 的設定，還有裝了那些 PHP 的 plugin。

然後你就可以瀏覽器瀏覽這個頁面看看 

```
http://你的網頁/info.php
```

有跑出東西就是成功了，沒跑出東西就看看設定檔有沒有打錯或者是有沒有更新設定檔，看完記得刪除。

到這裡就完成 LEMP 的設置了。





## 開啟 PHP 遠端連線

可以參考[這篇](https://www.digitalocean.com/community/tutorials/how-to-allow-remote-access-to-mysql)

開啟遠端連線就可以用自己的資料庫軟體來操作了。步驟大概是這樣：

1. 打開防火牆（包含 ufw & SG）
2. 設定 mySQL 的連線
3. 建立一個帳戶
4. 建立一個專屬於帳戶的資料庫
5. 設定帳戶權限

其實也可以自己試著用更開源的 MariaDB，但是設定方式就要再看一下，不過應該沒什麼很大的差異

### 打開防火牆

前面已經開了

### 設定連線

修改 `/etc/mysql/mysql.conf.d/mysqld.cnf` 修改 `bind-address` 成為 0.0.0.0，也就是允許任何 IP 連線的意思。

```
lc-messages-dir = /usr/share/mysql
skip-external-locking
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address   = 0.0.0.0
```

```
sudo systemctl restart mysql
```

然後重新啟動，systemctl 可以用來管理整個 OS 上面的服務。

### 建立帳戶；資料庫；授權

```
mysql -u root -p
```
```
CREATE USER 'username'@'%' IDENTIFIED BY 'password';
```
先登入資料庫，後再建立一個新的帳戶，還記得前面提到的帳戶格式嗎？這裡可以用 % 代表你可以從任何 IP 來登入。

到這裡，可以先用 `SHOW GRANTS FOR [user];` 來看看自己的權限。 


```
CREATE DATABASE "database_name";
```

```
GRANT ALL PRIVILEGES ON 'database_name'.* TO 'username'@'%' WITH GRANT OPTION;
```

再檢查一次權限，可以看到已經有指定的 database 有存取的權限了。但是要注意，這樣給的是該資料庫最高的權限，還可以新增帳戶之類的，如果覺得安全性有疑慮不想要設定高的權限，可以看[文件](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html)照自己的要求來設定。或者是用下面的指令，可以只給予一些基本操作的權限。

```
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on 'database_name'.* TO 'username'@'%' WITH GRANT OPTION;
```

## 設定 https

在安裝 phpmyadmin 之前要先來設定 https，因為 phpmyadmin 是透過 http/https 連上 server，在透過 PHP 的介面操作資料庫。先設定 https 可以避免我們的操作暴露在網路上。這部分的內容主要參考[這篇](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)

https 需要一個 Certificate Authority (CA) 發放的證書 (certificate) 來幫我們的網頁認證。有一個很方便的東西叫做 certbot 可以幫我們處理這點。

### 安裝 certbot

```
sudo add-apt-repository ppa:certbot/certbot
```
```
sudo apt install python-certbot-nginx
```

先下載 certbot 的軟體庫，然後在下載 certbot。因為 certbot 的開發比較活躍，如果你適用預設的 ubuntu 軟體庫來下載的話常常已經是之前的版本了，所以我們這裡使用 certbot 自己提供的軟體庫來拿到最新的版本。

### 設定 nginx 

記得一開始我們設定過 CGI ，現在我們要到同樣的檔案去設定 https。打開一樣的檔案 `/etc/nginx/sites-available/example.com`，把自己的 domain name 加進去，包含 `www.domain.com` 以及 `domain.com`。

```
server_name example.com www.example.com;
```

這裡設定好直接儲存就好了，不用再連結一次，已經之前已經設連結了。

https 發證書是跟著 domain name 的，不是跟著 IP，所以要跟著設定 domain name 給 nginx 。想到這裡有點好奇說能不能發證書給 IP，有[查到](https://stackoverflow.com/questions/2043617/is-it-possible-to-have-ssl-certificate-for-ip-address-not-domain-name)說其實也可以，不過似乎很少這樣處理。

最後記得測試跟 reload nginx，可以去前面翻指令。

### 設定防火牆 

要把 ngnix 的 port 存取全部打開，SG 有設定了所以這邊沒有設定，想設定可以參考原文。

### 獲取 SSL 證書

接下來就超級快了，快到不行那種

```
sudo certbot --nginx -d example.com -d www.example.com
```

輸入上面指令可以獲取證書，如果有想新增的 subdomain 可以再加上自己要的 `-d`，沒有試過說能不能用 `*.example.com` 來讓所有的 subdomain 都登記在證書上面。不過應該可以試試看。

```
Output
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.

// 選項

Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```

中間可能會跳出 email 或什麼的可以照他的指示處理，還有上面這個，我是選 2 啦，內容可以自己看一下，在講要不要自動幫你轉到 https。

然後就好了，是不是超級快！！快來讓自已的網站也安全起來吧。

最後講一下說為什麼可以這麼方便幾乎是一行指令就讓你的 server 擁有高枕無憂的 https 連線好了。

有一個網站叫做 [lets encrypt](https://letsencrypt.org/zh-tw/getting-started/) 可以免費頒發 SSL 的證書，而 certbot 就是可以幫你自動連到 lets encrypt 申請證書，甚至在過期的時候也會自動幫你再申請！！簡直是 nice 到不行。

如果想要強制更新證書來測試說有沒有問題，可以：

```
sudo certbot renew --dry-run
```

如果沒問題就大功告成囉。









## PHPmyadmin

會把 PHPmyadmin 放在的 https 後面的原因是如果透過 http 連線來存取會比較危險一點（雖然可能沒甚麼要盜用我的資料庫...），所以在設定好 https 之後再開始處理 phpmyadmin。

phpmyadmin 的部分是參考[這篇](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-with-nginx-on-an-ubuntu-18-04-server)


### 安裝

```
sudo apt update
```
```
sudo apt install phpmyadmin
```

首先老步驟，更新還有下載 phpmyadmin。這裡突然很好奇說 apt update 是甚麼意思？是更新系統的意思嗎。後來發現不是，是更新可以下載的套件清單還有版本，所以每次 install 的時候都推薦跑一下。

中間會選說你用哪個 server，很可惜的都不是。可以直接按 `tab` 然後 `enter`。

再來，phpmyadmin 會幫你在 mySQL 裡面建立一個用戶，來存放 phpmyadmin 的資料，而且會要你輸入密碼，照做設定自己的密碼就可以了。

接下來會把 phpmyadmin 連結到 web-server 存取的網站資料夾裡面。
```
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```

追根究柢來說 phpmyadmin 其實就只是一堆 php 檔案而已，這個步驟跟把自己的 index.html 差不多。這個時候其實 phpmyadmin 就弄好了，可以輸入網址看一下。

```
https://server_domain_or_IP/phpmyadmin
```

但是這只是第一步喔，phpmyadmin 超夯，而且超多人在用，別人看到你的網站然後後面接著 `/phpmyadmin` 就可以看到 phpmyadmin，然後你又一定有個 `root` 的帳戶，可能你的密碼又超簡單，輕鬆登入你的資料庫，然後 `drop` 掉你的心血。

方便總要付出一點代價，雖然有 https 安全很多，但是接下來的設定可以讓你更安心地用 phpmyadmin。大概有這些步驟

- 更改 phpmyadmin 的資料夾名稱
- 禁用 `root` 使用 phpmyadmin 登入
- 讓進入 phpmyadmin 以前需要再進行驗證

### 更改資料夾名稱

這步驟超簡單，但是還蠻有用的。

```
cd /var/www/html

sudo mv phpmyadmin secret_admin
```

`secret_admin` 可以自行填入。這樣可以避免自動掃描，或者是那種喜歡動不動就偷看一下的人（像我就是...）。

### 禁止 `root` 使用 phpmyadmin 登入

```
sudo nano /etc/phpmyadmin/conf.d/pma_secure.php
```
```
<?php

# PhpMyAdmin Settings
# This should be set to a random string of at least 32 chars
$cfg['blowfish_secret'] = '任意輸入32字元的字串';

$i=0;
$i++;

$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['AllowNoPassword'] = false;
$cfg['Servers'][$i]['AllowRoot'] = false;

?>
```

建立一個 pma_secure.php，然後放進去上面的設定。自己也還沒理解所有的設定，但重要的是下面三個。

-  `['auth_type'] = 'cookie'`：讓我們可以用 cookie 來連線，預設的連線方式是 config 有點危險，上面的 blowfish 可以設定驗證 cookie 的 token，系統會要求要打滿 32 字。
- `['AllowNoPassword'] = false;`：不讓你用免密碼登入
- `['AllowRoot'] = false;`：這個就是我們的目標了，禁用 root

設定完之後可以試著用 root 登入看看。

### 讓進入 phpmyadmin 以前需要再進行驗證

大部分的 webserver 可以設定說特定的網站需要透過另外登入才可以進去，這樣可以不讓一些比較邪惡的爬蟲找到我們的 phpmyadmin。

首先我們要用 openssl 來幫我們建立一組密碼，openssl 是一個提供很多種常用加密方式的工具，已經內建在 ubuntu 上了，常用 linux 會很常看到這個東西。

```
openssl passwd
```

然後輸入你的密碼，會跑出加密過後的密碼。

```
Output
O5az.RSPzd.HE //會跑出你自己加密過的密碼
```

然後修改 nginx 的設定，把我們的帳戶加進去。

```
sudo nano /etc/nginx/pma_pass
```

加入你自己想要的帳號跟密碼

```
你要設定的帳號:剛剛加密過的密碼
```

再來要設定哪些資料夾需要透過帳號密碼驗證才可以進入，懂這個方法之後，其實你也可以自己把你想要的資料夾加入帳號密碼驗證，可以做一個自己的後台。其實也不難，還記得前面我們的 nginx 設定檔嗎？

location block 可以設定存取到特定位置時的動作，我們在 `/secret_admin` (依照剛剛設定的資料夾)裡面設定我們要使用的授權方式，並選擇剛剛建立的帳戶檔案。
```
server {
    . . .

        location / {
                try_files $uri $uri/ =404;
        }

        # 只要加這段進去
        location /secret_admin {
                auth_basic "Admin Login";
                auth_basic_user_file /etc/nginx/pma_pass;
        }

    . . .
}
```

內容自己覺得直觀的，雖然這篇沒有提到 nginx 的設定，但是可以稍微理解設定的方法。

話說這篇可能比較沒內容，覺得這裡的概念似乎沒有那麼複雜。

## FTP server

終於到最後了，這裡就是自己花最多時間的地方。有一個 ftp Server 之後上傳東西會方便很多，這篇的內容參考自[How To Set Up vsftpd for a User's Directory on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-for-a-user-s-directory-on-ubuntu-18-04)，但是有修改過很多東西。

這部分會比較不同，設定大多是自己研究的，有可能有很多問題或者是還有待優化的部分，歡迎大家一起 debug XD，那一樣先來講講要幹嘛。

我們要做的事情有
- 建立一個獨立的帳戶能夠登入 FTP
- 可以傳輸我們的檔案到 `/etc/www` （web server 存取的資料夾）裡面
- 這個帳戶透過 FTP 只能存取到 `/etc/www` 沒辦法再存取上層目錄（安全問題）
- 只有這個帳戶可以用 FTP 登入
- 開啟 ssl 加密的功能

為什麼是 `/html/www`，因為原本想設定 `/etc/www/html` 然後失敗很多次，灰心喪志，後來發現自己偶然設定成 `/html/www`，就放過自己了...

單純的 FTP 就像 http 一樣會讓你在這個網路世界中裸奔，這裡我們會使用 FTPs 來連線，在 FTP 的基礎上使用 ssl 來加密。另外還有一種稱作 SFTP，能夠在 ssh （我們登入 server 採用的協議）的基礎上使用 ftp 傳輸，詳細的內容可以看[這篇](https://www.trustauth.cn/wiki/13883.html)。



### 安裝 vtftpd

我們會使用 vsftps 來作為我們的 ftp server，[這裡](http://vsftpd.beasts.org/vsftpd_conf.html)是他的文件。首先是下載，應該很熟悉了。

```
sudo apt update
sudo apt install vsftpd
```

然後我們複製一個 vsftpd 的設定檔，留一個原版之後還原用

```
sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.orig
```

### 建立帳戶、設定家目錄以及權限

FTP 登入的帳號和 unbuntu 本身帳戶是一樣的。所以我們要先再系統上面建立一個帳戶。

```
sudo adduser username
```

新增完會需要輸入密碼，就依照上面的指示。在來修改家目錄，家目錄就是當我們一開始登入的時候，進入的資料夾，我們會設定 FTP 登入這個帳戶的時候，會直接進入我們的網頁資料夾。passwd 是存放 ubuntu 用戶資料的檔案。

```
sudo vim /etc/passwd
```

可以修改帳戶的一些資料，然後滾到最下面會看到我們剛剛的帳號名稱。到那一行之後，改成下面這行。

```
username:x:1001:1001:,,,:/var/www:/bin/bash
```

基本上就是修改最後一個冒號跟倒數第二個冒號的內容，這裡可以修改家目錄。

```
sudo chown -R username /var/www
```

修改 `/var/www` 以及底下所有檔案的所有者，原本是屬於 root 的，我們把它改到剛剛設建立的帳戶下面，讓我們可以操作下面的檔案。

從建立帳戶之後作法可能會有很大的爭議，照理來說你有幾種做法，只要讓新建立的帳戶可以存取就好。列一下自己的幾種想法：

- 把新帳戶加入 root 群組  
  覺得這個不太妥，很多重要的資料夾都是 root 群組的
- 把 `/var/www` 的 owner 改成 new_user`  
  這裡是自己採用的做法，想法是這樣可以讓 root 有最高的權限（group 還是 root），又可以讓 new_user 可以存取裡面的東西
- 改變 `/var/www` 權限變成 776，也就是

  - 擁有者：讀、寫、執行
  - 群組：讀、寫、執行
  - 其他人：讀、寫
  這個個人是覺得不太妥，這樣權限開太廣了
- 建立一個 new_group，然後把 `/var/www` 的 group 改成 new_group，在把 new_user 放進去 new_group。  
  這個似乎是最穩妥的作法，但是好麻煩ㄚ...

這裡應該還可以思考看看如何利用帳戶、群組、還有資料夾權限來得到一個最佳解。

<details><summary>linux 權限</summary>


剛剛有提到權限 776 ，稍微講解一下，linux 的資料夾權限分：
- 三個對象：
    - 擁有者
    - 群組
    - 他人
- 三種權限
    - 讀取(r, 4)
    - 寫入(w, 2)
    - 執行(x, 1)

如果擁有者可以讀取 & 寫入，那擁有者的權限就會是 `4 + 2 = 6`。然後權限的三個數字會依序是擁有者、群組、他人，所以剛剛的 `776` 就是：

- 擁有者：讀取、寫入、執行
- 擁有群組：讀取、寫入、執行
- 他人：讀取、寫入

這個是 Linux 的權限表示法，可以用在更改檔案夾的權限，搭配指令 `chmod`

也可以用下面指令來看路徑內的檔案及資料夾的所有檔案權限：

```
ls -al /path
```

最前面會有一個第一次看很詭異的表現方式

```
-rwxr-xr-x.
```

第一個字如果是 `d`，表示是資料夾，是 `-` 表示是檔案。接下來三個一組分別表示 讀取、寫入、執行。然後三組分別是，擁有者、擁有群組、他人。

所以上面就是
- 不是資料夾
- 擁有者：讀取、寫入、執行
- 擁有群組：讀取、執行
- 他人：讀取、執行

</details>

### vsftpd 設定
```
sudo nano /etc/vsftpd.conf
```

編輯設定檔。

後面的設定一堆，設定原因可以看註解，或者是自己查文件。會提到自己覺得比較特別的，而且這裡是自己的設定，跟參考文章上面有點差別。有 ❗ 的部份表示我自己也沒有非常了解這些設定，但目前這樣是 OK 的，這方面希望多多交流~~debug~~。

```
# Allow anonymous FTP? (Disabled by default).
anonymous_enable=NO
#
# Uncomment this to allow local users to log in.
local_enable=YES

write_enable=YES


chroot_local_user=YES                 # ❗ 讓使用者不能移開設定家目錄以外的地方，不太清楚說是不能離開家目錄還是下面的 local_root，可能需要做實驗
local_root=/var/www/                  # ❗ 設定進去的資料夾，有點不清楚和家目錄的關係，但目前這樣是可以用的 XD
allow_writeable_chroot=YES            # 可以在根目錄寫入資料

local_umask=022                       
file_open_mode=0777                   
❗ 這兩個要一起看，可以設定上傳上去檔案的權限，自己的理解是，權限會是 `file_open_mode` - `local_umask`，所以就是 777(前面的 0 這裡可以忽略) - `222` = `755`。

# 設定 ftp 被動連線的端口
pasv_min_port=40000
pasv_max_port=50000


userlist_enable=YES                   # 啟用 userlist 來限定只有特定的用戶可以登入
userlist_file=/etc/vsftpd.userlist    # 使用 `/etc/vsftpd.userlist` 來作為 userlist
userlist_deny=NO                      # 在 userlist 代表用戶的白名單，如果是 YES 則代表黑名單
```

接下來建立 vsftpd.userlist
```
echo "sammy" | sudo tee -a /etc/vsftpd.userlist
```

重啟 vsftpd
```
sudo systemctl restart vsftpd
```

到這裡可以用新增的帳戶登入看看，可以用 filezilla 或者是看上面的參考文章

### 設定 ssl 

建立 ssl 金鑰，其實這裡的金鑰就是 certbot 發給我們的金鑰，所以搞不好也可以沿用，不用自製的？
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/vsftpd.pem -out /etc/ssl/private/vsftpd.pem
```
```
Output
Generating a 2048 bit RSA private key
............................................................................+++
...........+++
writing new private key to '/etc/ssl/private/vsftpd.pem'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:NY
Locality Name (eg, city) []:New York City
Organization Name (eg, company) [Internet Widgits Pty Ltd]:DigitalOcean
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []: your_server_ip
Email Address []:
```

然後又是改設定了

```
# rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
# rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
# 這兩行預設值註解掉

rsa_cert_file=/etc/ssl/private/vsftpd.pem
rsa_private_key_file=/etc/ssl/private/vsftpd.pem
# 用自己的金鑰比較有感情

ssl_enable=YES

allow_anon_ssl=NO               # 禁止匿名用戶
force_local_data_ssl=YES
force_local_logins_ssl=YES

require_ssl_reuse=NO            


# ❗ 下面的我沒有設定但文章有，之前設定好像怪怪的... 但不太清楚原因，可以試試看
ssl_tlsv1=YES
ssl_sslv2=NO
ssl_sslv3=NO
ssl_ciphers=HIGH
```


加上前面的設定，自己的設定檔是這樣的（去掉註解）

```
listen=NO
listen_ipv6=YES
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
file_open_mode=0777
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
connect_from_port_20=YES
 chroot_local_user=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd
rsa_cert_file=/etc/ssl/private/vsftpd.pem
sa_private_key_file=/etc/ssl/private/vsftpd.pem
ssl_enable=YES
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO
require_ssl_reuse=NO
local_root=/var/www/
allow_writeable_chroot=YES
pasv_min_port=40000
pasv_max_port=50000
```

至少這樣設定應該是沒問題啦。如果一樣了，還不能用就可能是其他問題，可能像是：

- 防火牆
- AWS 的 SG
- 檔案夾的權限
- 帳戶的權限

上面都是我遇過的問題 😥。最後再 `sudo systemctl restart vsftpd`

好了之就可以用 filezilla 登入看看了。會跳出說可疑的證書（親手製作的證書被說可疑太傷心了），大方給他按 ok 平反下去，就可以登入啦。


## 參考資料
統整一下參考資料

LEMP server
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04

phpmyadmin
https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-with-nginx-on-an-ubuntu-18-04-server

https
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04


mysql 權限
https://zhuanlan.zhihu.com/p/55798418
如果是 localhost 就表示只能從本地登入（phpmyadmin 也是）如果是 % 就代表全部

新增 ssh 的 short cut，文中沒提到，可以自己弄看看，很方便
https://scotch.io/tutorials/how-to-create-an-ssh-shortcut

FTP server
https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-for-a-user-s-directory-on-ubuntu-18-04

openssl 的文章
https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs

## 其他問題

❓ 什麼是 SSH
Ssh (Secure Shell) 是一種協定，可以用來作為 client 跟 server 的連接，簡單說就是可以讓我們安全的登入 Server。


❓ security group 跟 linux 裡面的 firewall （像是 ufw 等）有甚麼差別？

功能上類似，主要是在 server 的哪個環節阻擋的問題。防火牆是可以阻擋網路傳輸內容工具的統稱，實際上可以在很多不同網路的層面來實現這個功能，可能是從 router 就開始阻擋（就是你國小電腦課老師開的東西），或者是運用系統內建的軟體來阻擋（windows 常常莫名其妙跳出來的東西）。

linux 的內核有提供稱作 netfilter 的模組來阻擋或者說過濾網路傳輸的內容，也就是剛剛提到的軟體防火牆（應該是，有錯在麻煩更正），而操作 netfilter 這個防火牆的介面就是 iptable。因為直接操作 iptable 很麻煩，所以就有了一個 ufw （uncomplicated firewall）來讓我們這些菜鳥也能夠好好的操作 netfilter。

而 security group 就是在 VPS 外面，AWS 所提供的防火牆，功能跟 ufw 是一樣的。

參考資料：
https://serverfault.com/questions/884156/difference-between-security-groups-on-aws-and-iptables
https://serverfault.com/questions/286665/why-have-both-security-groups-and-iptables-on-amazon-ec2
https://www.awsforbusiness.com/aws-security-groups-different-firewalls/
https://medium.com/awesome-cloud/aws-difference-between-security-groups-and-network-acls-adc632ea29ae


## 感想

> 如果你這週是順利的，未來某一天你一樣會經歷這個崩潰的過程。如果你這週本來就很崩潰，放心，以後還有更多讓你崩潰的事。  
>  \- Huli

好吧這裡先崩潰一次了... 往好處想，至少之後可能不會遇到這麼崩潰的事情（立 flag）