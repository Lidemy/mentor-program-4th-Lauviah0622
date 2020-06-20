## 請解釋後端與前端的差異。

我們平常打開瀏覽器，輸入網址，瀏覽器會發出 request 至 server，而server 收到 request 之後會依照 request 的不同要求，**解析、處理過後做出相對應的 Response** 回來給瀏覽器。

而瀏覽器收到 response 後，**會解析 response 中的內容，並執行裡面的程式碼**，最後看成為我們看到的網頁。

瀏覽器收到的 resqonse 內容，並被瀏覽器解析、執行的內容我們稱作為前端。

接收 request 進行解析後依照 server 中的程式運行， 最後送出 request 這部份我們稱做為後端。


## 假設我今天去 Google 首頁搜尋框打上：JavaScript 並且按下 Enter，請說出從這一刻開始到我看到搜尋結果為止發生在背後的事情。

### 簡單版

1. 推薦網站 & 自動完成

    當你輸入時，現代的瀏覽器大多會做兩件事情
    1. 依照你之前的歷史紀錄，來給你推薦的 url

        這個功能就比較單純，分析歷史紀錄中的出現次數以及出現時間。來推估你可能會進入的 url。

    2. 依照 browser 連線的資料庫，來推估說大部分輸入 "Javascript" 可能的搜尋字詞。

        這個功能就複雜了，自己目前設想的可能應該是每次在輸入字元的時候都會送出 request ，每次都會 response 可能的搜尋字詞。
        
        要怎麼搜尋方式可能就要牽扯到演算法，像是 tree 之類的東西？
        可能需要多找點資料。

2. 按下 enter，送出 request
    
    當你搜尋 "Javascript" 的時候，可以觀察一下網址，也就是 url ，會是 

        https://www.google.com/search?q=javascript <...後面可能有其他東西>
    
    你可以試著修改 url 中 "javascript" 的部分，那麼搜尋的結果也會隨之更換。
    
    而且當你複製上面的 url 到新的分頁時，也會是相同的搜尋結果。  
    因為網址列的輸入搜尋，其實也只是代表直接幫你導向

        https://www.google.com/search?q=[你搜尋的東西]

    上面這個網頁而已。

    所以瀏覽器在你輸入然後按下 enter 的時候，他就會依照上面的 url 幫你送出 request 給 server 了

3. DNS server 查找 ip 位置，並 response 對應結果。

3. browser 解析 response，然後利用 ip 送出 request。

3. server 解析 request，從 server 中查找相關資料。

4. server render 出網頁內容並製作 response 回傳給 browser。

5. browser 解析 response 並將 response 中的檔案轉化成可視的網頁內容。

    

<details>
    <summary>超進階版（未完成）</summary>
之前看過一篇文章，[从输入 URL 到页面加载完成的过程中都发生了什么事情？
](http://fex.baidu.com/blog/2014/05/what-happen/)，很詳細的講解了這整個過程，這裡面知識的深度跟廣度直接讓自己瞠目結舌，很佩服作者的對於這些內容的研究跟了解。


從想要按 enter 到按下 enter

鍵盤觸發按鍵訊號

電腦硬體

驅動程式

瀏覽器送出 request

server 查找資料

接收 reqponse 後瀏覽器渲染

顯示圖形

螢幕顯示

眼睛視物
</details>

## 請列舉出 3 個「課程沒有提到」的 command line 指令並且說明功用

- `alias`：建立命令別名。有點像我們平常設定捷徑的概念。
    
    用法挺簡單的喔。

    ```
    alias gst="git status"
    ```

    當你輸入這個後，以後只要打 gst 就和 git status 完全相同。

    如果你要查說自己有那些 alias 。就輸入 `alias` 就可以了。

    想要取消呢，例如要取消剛剛設定的 `gst` ，那就輸入 
    
    ```
    unalias gst
    ```

    這樣就可以取消囉。
    簡單來說：`alias <別名>="<指令>"`，可以建立代稱。`unalias <指令>` 可以取消代稱。

- `history`：查看指令的歷史紀錄。

    感覺講這個有點廢哈哈哈哈，在 bash 裡面按 ↑ 鍵，就會跑出上一次輸入過的指令，繼續按 ↑ 或 ↓ 就可以繼續選擇。這個功能我們稱作歷史紀錄 history 。輸入 `history` 就可以查看所有的歷史紀錄了，但是最多只能儲存 1000 則喔。

- `cut`：在課程中，教過 Grep 來搜尋符合特定字串的資料，cut 則是可以**以行為單位**（這很重要），來切割出符合特定位置的字串。 `cut` 有兩種模式
    - `cut -d`：依照要分隔的字元切割。
        
        依照字元切割是甚麼意思，如果有一個單字是：
        > Pneumonoultramicroscopicsilicovolcanoconiosis

        那我們要依 "i" 這個字元來切割，就會被切成
        > Pneumonoultram **i** croscop **i** cs **i** l **i** covolcanocon **i** os **i** s

        總共被切成七段。

        所以當我們想要利用字元來切割出特定的字串時，想當然我們必須要有兩個資訊
        1. 用來分割的字元  
        2. 分割後的哪一個部分

        知道了這個我們就可以來使用 `cut -d` 這個指令了，如果要切割剛剛上面那個字串，並取得第 3, 4 個切割片段的話，我們需要輸入

        ```shell
        echo Pneumonoultramicroscopicsilicovolcanoconiosis | cut -d "i" -f 3-4
        ```
        
        簡單條列出來指令就是：`cut -d <分割字元> -f <選取部分>` 。
        
        要注意的的是選取部分可以使用 `3-5` 表示從 第 3 部分到第 5 部分。或者也可以使用 `3,5` 表示單獨的第 3 部分及第 5 部分。


    - `cut -c`：依照要分隔的位置切割  

        這個就直觀很多了，就是單純的從特定位置切割。

        指令是 `cut -c <裁切位置>`
        
        ```
        echo Pneumonoultramicroscopicsilicovolcanoconiosis | cut -c 10-20
        ```

        就是從第 10 個字到第 20 個字，簡單吧？
        
        你也可以 `cut -c 10-` ，就是第 10 個字之後的你都要，或者是 `cut -c -10` 第 10 個字之前的你都要