## 交作業流程

1. **建立 課綱的 repo 副本**
  
    > repo 是 repository 的意思，可以翻譯成資料庫，使用 git 的一整個資料夾，或者是 github 上面的一個專案，我們會稱為 repo。

    首先，你要先用 github classroom 建立一個課綱 repo 的 "副本"。
    
    可以點擊[這個連結](https://classroom.github.com/a/SbDvk2VA)，登入之後會給你一個 github repository的連結，這個 repo 就是建立在 Lidemy github 下面屬於你自己的課綱。

2. **將 repo 抓到自己的電腦上。**

    點進去之後，你會發現內容和 Huli 的課綱一模模一樣樣，唯一的不同是，但是上面的 repo 名稱變成 `mentor-program-4th-<你的名子>`。
    
    >**自己的課綱** 

    >![](https://i.imgur.com/iGTz55r.png)

	>**huli 的課綱**

    >![](https://i.imgur.com/0PO0erj.png)

    > 可以看到自己的課綱在名稱、描述、還有 watch, star, fork 等等都不一樣。

    在自己的課綱點擊 clone，複製 repo 的 URL 位置。然後在 command line 上面輸入將 server 的 repo 複製到自己電腦的指令 ： *`<   >` 表示依照狀況輸入內容* 
    ```shell
    git clone <repo 的 URL>
    ```
    
    這樣一來你就將你自己的課綱從 server 抓下來了，可以開始做作業啦。做到這裡，可以用 command line 進到我們作業的資料夾`。

    ```
    cd <作業的路徑>
    ```
    然後試著看看裡面有甚麼東西
    ```
    ls 
    ```
    
3. **建立 branch**

    在開新功能之前，建立一個 branch 是好習慣，寫作業也一樣。所以我們先建立一個 branch，我們假設叫做 work1。
    
    ```
      git branch work1
    ```
    然後跳到這個 branch 裡面做東西

    ```
      git checkout work1
    ```
    > 你也可以用 `git chcekcout -b work1 ` 同時建立 branch 跟跳過去。
    
4. **做作業啦**  

    開好 branch 就可以在裡面做作業了，但做完之後記得自己先檢查一下格式或者是一些基本的測試。

5. **建立新的版本（commit)**

    做好之後就可以建立新的版本了，`git add` 會將檔案加入版本控制， 後面的 `.` 則是代表所有的檔案

    ```
    git add .
    ```

    加入版本控制之後就可以新增新的版本囉～

    ```
    git commit -m <版本的訊息>
    ```

    你可以在版本的訊息裡面輸入你在這次的作業改了甚麼。因為作業可能會分好幾天做，所以也可能建立多個 commit 方便自己看之前做了那些更動，這時commit message 就影響很大，可以讓自己快速 check 到底改了哪些東西]。

6.  **將新的 branch 同步到 github 上面**

    雖然自已電腦中的 repo 已經更新了，但是我必須將新建的 branch 同步到 github 上面讓助教看到才能改作業。

    ```
    git push -u origin work1
    ```

    上面這個指令除了將 branch 上傳到 origin（其實就是自己課綱 repo 的一個代稱），還設定了快捷的方式，讓 homework 這個 branch 以後預設就是 Push 到這個 github 上面的 homework 這個 Branch。

    所以如果你不是第一次 Push branch 的修改，那可以在這個 branch 中直接使用
    
    ``` 
    git push
    ```

7. **pull request**

    光上傳上去還不夠，切換到自己課綱的 repo 頁面。可以點擊 branch 看看自己有哪些 Branch，應該會有自己剛剛新 push 上去的 branch。
    
    ![](https://i.imgur.com/efkPbXP.png) 

    這時，切換到 `work1`，然後點擊旁邊的 `new pull request`。這樣就可以送出這次的作業的 branch。
    
    再來，**記得要將 pull request 的頁面網址複製到學習系統中**
    
    ![](https://i.imgur.com/fD5NcPM.png)

    如果助教審核通過的話就會 merge branch 到 master，這次的作業基本上就大功告成啦！ 

8. **delete branch & pull repository**

    上傳完之後還有最後一個步驟，現在 github 上的 repo 已經把 work1 merge 進 master 了，那麼這個 work1 基本上就沒甚麼用了。
    
    我們就可以在 github 上面把她刪除，可以到 branches 的頁面點擊 branch 旁邊的垃圾桶。或者是到 Pull request 的頁面也可以刪除。

    ![](https://i.imgur.com/uGoknXw.png)

    最後是把 github 上已經 merge 過的 repo 的內容同步到自己的電腦裡。因為我們已經把 work1 merge 進 master 了，所以理所當然的我們應該要切換到 master。

    ```
    git checkout master
    ```
    
    再同步 branch。

    ```
    git pull
    ```
    
    這樣就好啦。還有別忘記把電腦裡的 branch 也一起刪除。

    ```
    git branch -d work1
    ```

    如此一來就完成交作業的流程了！




