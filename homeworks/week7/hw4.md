## 什麼是 DOM？
目前對於 DOM 的理解是。 這是由 W3C 制定標準，然後由 browser 提供的一組 API，讓我們可以操控 HTML 中的內容。

## 事件傳遞機制的順序是什麼；什麼是冒泡，什麼又是捕獲？
先從最上層開始觸發事件，

1. 捕獲 captrue phase：事件從最上層 html => body => ... => 到 event.target 的父層
2. target phase ：事件傳遞到 event.target (再 eventlistener 中不管是 capture 和 bubble 都會觸發到)
3. 冒泡 bubble phase ：事件從 event.target 父層再回到html

## 什麼是 event delegation，為什麼我們需要它？

有一天，小明看著 Huli 的文章，決心要發憤圖強。於是在 `<div>` 裡面放入很多 `<button>` ，想要做一個簡單的小小 side project - 計算機。

計算機有很多按鍵。沒關係，有志者事竟成，小明照個 w3school 上面教的，幫每一個按鍵加上 `addEventListener('click')`。所以我們的 code 就會像這樣。

```javascript
document.querySelector(+).addEventListener('click', ...)
document.querySelector(-).addEventListener('click', ...)
document.querySelector(*).addEventListener('click', ...)
document.querySelector(/).addEventListener('click', ...)
document.querySelector(1).addEventListener('click', ...)
document.querySelector(2).addEventListener('click', ...)
document.querySelector(3).addEventListener('click', ...)

// 還有很多行...
```

小明把他的 code 拿給他最新下載的 DRYlint 檢查 code 夠不夠 DRY。 DRYlint 會依照 code 的 DRY 程度給予對應的評價。結果是：

> ![](https://i.imgur.com/2QUArf7.png)

damn，計算機至少也要有 0 ~ 9 ，再加上加減乘除還有等於，所以至少打 15 次 `document.querySelector(3).addEventListener('click', ...)`。我們不應該做一個勤勞的工程師。

不過聰明如小明，怎麼可能不知道 DRY 的道理。他把一堆東西包進 function。還把 selector 跟 callback 塞進物件來做對應。

```javascript
function addBtnHandler(selector, callback) {
  document.querySelector(selector).addEventListener('click', callback);
}

const btnToOpe = {
  + : function ...,
  - : function ...,
  // ...
}

// ...下面自行想像
```

這樣應該行了吧？再用 DRYlint 跑跑看，沒想結果竟然：

> 
> ![](https://i.imgur.com/0Tvv3pI.png)

怎麼可能！這應該已經是最簡潔的方式了！當小明這麼想著，越想越生氣。突然，一陣頭痛，腦中竟然出現神祕的聲音：

> 小明，你已經已經把程式碼最簡化了，但是它忽略了 DOM 中超重要的一點 --- **event Bubbling**。
>
> 當事件(event)在 event.target 觸發之後，事件會從 event.target 向父層一直傳遞上去，~~直到天堂為止~~。
>
>![](https://i.imgur.com/kDbCD4I.png)
>
> **既然如此，與其在子層苦苦一個一個設 listener，何不在直接在父層一把抓？**，只要在父層 `addEventListener()` 這樣就不用辛辛苦苦的在每個 button 一個一個加了。

經過神祕的聲音開導之後，小明突然醍醐灌頂。key 透 screen 背，揮毫寫出以下程式碼。

```javascript
document.querySelector('container').addEventListener('click', function (e) {
  // ...  
})
```

他在這些按鍵的父層加上 `eventListener` 然後在依照按鍵內容去判斷，執行對應的操作。他興沖沖的他剛做好的 Side Project 用 DRYlint 測試，結果：

> ![](https://i.imgur.com/kf2G63O.png)

小明終於獲得了 DRY 的評價！於是，小明今天又向 senior 更進一步了。


### 總結
#### event delegation是啥？
在父層（應用上通常是父層，）`addEventListener`，來接收子層的 event。
#### 有甚麼好處？
- 程式碼簡潔  
  不用每個元素都監聽事件 ，只要在父層監聽就好。

- 擴充性  
  如果子層有新增元素，不用再新增 listener。

#### 小明腦中的聲音是甚麼？
請待下回分解。

## event.preventDefault() 跟 event.stopPropagation() 差在哪裡，可以舉個範例嗎？
平常我們跟網頁上的東西互動，瀏覽器基本上做了兩件事情  
1. 接收你的互動，可能是點擊之類的
2. 做出對應的動作

`target.addEventListener(type, callback)` 也一樣做兩件事情。
1. 偵測你對 target 的動作
2. 執行對應的 callback

**`event.stopPropagation()` 處理的是剛剛說的第一件事情：**

因為 event 會先 capturing 向下捕捉然後再 bubbling 向上傳遞。請看下圖：

![](https://i.imgur.com/H7RNhVp.png)

那如果有一天，我不想要她 capturing 下去或者 bubbling 上去怎麼辦？

可以在 callback function 執行 event.stopPropagation()。那 event 就不會再向下捕捉/傳遞上去。

**而 `event.preventDefault()` 處理的是第二件事情：**
有一些元素會有預設行為，例如點擊 `<a>` 會自動開啟網頁、`<button type="submit">` 會自動幫你送出 get 請求。如果不想要這些預設的行為呢？

就在 callback function 裡面執行 `event.preventDefault()` 就可以避免這些狀況囉。Big guy is John。

