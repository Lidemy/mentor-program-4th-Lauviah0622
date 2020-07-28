## 請找出三個課程裡面沒提到的 HTML 標籤並一一說明作用。
#### `<canvas>`
> 「藝術家用腦，而不是用手去畫。」- 米開朗基羅（人）

> 「工程師用 Code，而不是用手去畫。」

想在網頁的世界揮灑你的藝術細胞嗎？這個 tag 可以滿足你。從字面上就可以知道，它可以幫你建立一塊"畫布"。那畫筆是甚麼呢？當然就是 HTML 的好朋友 JS 啦。
#### `<code>`
> 「程式應該是寫給其他人讀的，讓機器來執行它只是一個附帶功能。」 - 《The Structure and Interpretation of Computer Programs》Harold Abelson and Gerald Jay Sussman

> HTML：「我這不就寫給你讀了嗎？」

當你用這個 tag 取代你原本的 `<p>` 。哇，就能得到成很像程式碼的內容了呢！即便那不是真的程式碼，不過對老闆而言這不重要對吧？

把你打的東西變成很 nerd 的樣式是他唯一的功能。
#### `<object>`
> JS：「我的 object 可以放進任何東西。」

> HTML：「我也是。」

這個 tag 可以放入任何的外部資源，pdf, 圖片, 影片等等的東西。他會將外部資源在範圍內呈現，可以在用 width 還有 height 設定長寬。

## 請問什麼是盒模型（box modal）
HTML 有著各種不同的元素，這些元素依照不同的需要被使用。每一個元素都佔有著自己的空間，而我們正是利用這些元素每個空間的部分的不同大小來排版的。box modal 就是這些元素空間的構造，或者說是怎麼組成這些元素的空間。

阿這些元素的空間都是正方形的，然後又會區分為裡面與外面的空間，就像盒子一樣，所以叫做盒模型。

![](https://s3.amazonaws.com/viking_education/web_development/web_app_eng/css_box_model_chrome.png)

## 請問 display: inline, block 跟 inline-block 的差別是什麼？
### inline：
元素本身設定：沒辦法調整大小、上下 margin 不能改變、padding 只會影響自己的元素而不會影響其他元素
元素的位置：跟著 "行" 來排列

### block: 
元素本身設定：可以調整大小、padding。
元素的位置排列：佔滿整行，不和其他元素並排
### inline-block
元素本身設定：可以調整大小、padding、margin。
元素的位置排列：對外則是依照行來確定位置



## 請問 position: static, relative, absolute 跟 fixed 的差別是什麼？
### static
依照預設的排版流設定位置，而且不能加以偏移。

### relative
在原本排版流的基礎上，可以再加以偏移，設定上下左右的偏移量。

### absolute
完全獨立於原本的排版流，以 "最近且 position 非 static 的母元素" 作為位置的基準點。並且可以加以設定上下左右的偏移。

### fixed
完全獨立於原本的排版流，以 "整個畫面（viewpoint）" 作為位置的基準點，可以加以設定上下左右的偏移。
