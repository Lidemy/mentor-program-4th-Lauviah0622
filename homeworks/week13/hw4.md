## Webpack 是做什麼用的？可以不用它嗎？
要寫程式，要寫得清楚、好維護，不論如何都離不開模組化開發。

JS 最早的時候語法不支援模組化，但是可以透過一些套件配合協定（大家約好的幾種模組化語法）來讓 JS 可以滿足模組化開發的需求，雖然開發可以用模組化。但是瀏覽器的執行環境卻不支援這些協定，所以你沒辦法簡簡單單的把你模組化開發的各個檔案引入進來就高枕無憂的在網頁上執行。

身為前端怎麼可以就這樣止步！我們還是需要模組化開發！既然瀏覽器不支援，那我們就在最後產出的時候把自己模組化開發的東西組合起來就好了嘛！組合起來再一次引入到網頁裡面。山不轉路轉，路不轉就搭飛機。而那個組合起來的功能叫做 bundle （打包），webpack 是一種 bundler ，也就是用來打包的套件（其實最早還有一個東西叫 browserify，但是被 webpack 打趴了）。

但是這些都是前輩時代的事情了，前人種樹、後人乘涼，現在**最新**瀏覽器已經支援模組化了，但問題就在**最新**兩個字，不喜歡更新~~不想先幫工程師做測試~~的人可是一大堆呢，更何況還有考古學家還在 IE 中打滾。所以我們還是需要 bundler 幫我們打包。

況且 webpack 的神奇還不只這些。webpack 的野心很大，當我們只著眼 JS 時，webpack 已經放眼世界、征服宇宙（既視感）。webpack 把所有東西都當作模塊，CSS 是模塊、圖片也是模塊、html 也是模塊~~你們這些碼農也只是我大 webpack 的模塊，不是你在寫 code，其實是 code 在寫你~~。而且還可以在加入模塊的過程中**加工模塊**，像是 minify 跟 uglyfy，還有其他騷操作。所以知道為什麼 browserify 會被打趴了吧，重點是格局！是眼界！

#### 結論：

> Webpack 是做什麼用的？

就是將模組化開發的語法組合成一個檔案的好用東西。

> 可以不用他嗎？

滿足下面幾種條件就可以
1. 你的 Project 不用支援舊舊的瀏覽器，不用 bundle
2. 你不需要模組化開發也能寫出好維護的 code
3. ~~你的網頁不是 SPA~~（其實好像也可以用，這裡突然想到說，webpack 能夠有多個入口點打包多個檔案嗎？）。

## gulp 跟 webpack 有什麼不一樣？
剛剛有講到 webpack 是把程式碼組合起來的工具（bundler）

gulp 是啥？gulp 是流程自動化工具。例如在開發時的東西，到 production 的時候需要經過 A 經過 B 經過 C 之後才執行 code。所以你就要手動的執行 A 執行 B 執行 C，這也太麻煩了吧，所以你就用一個 gulp 自動幫你 A, B, C。你只需要 glup 下去 A, B,C 就都幫你執行好了，不用自己處理。

那麼 gulp 跟 webpack 有什麼不一樣？

webpack 的功能是打包，gulp 的功能是把處理的流程自動化。本質上是不一樣的東西，之所以會搞混應該是他們處理的事情很像。有點像開車跟搭火車都可以到目的地，但是開車跟搭火車本就是不同的交通工具。

## CSS Selector 權重的計算方式為何？

~~把 seletor 丟到網站上就知道了~~

Selector 計算方式基本上就是數東西，首先我們要先來分類：

第 0 類： `*`, combinator 連結符（像是 `>`, `     `, `+`...）, `not()`
第 1 類： type selector `div`, psuedo-elements `::before` `::after`
第 2 類： class selector `.class`, attribute selector 屬性 `[attr='value']`, pseudo-class `:hover`
第 3 類： id selector `#id`

然後開始數，第 0 類不用算，然後數說看有幾個一, 二. 還有 三
```
[三, 二, 一]
```

```
* { }	                    [0, 0, 0]
li { }                      [0, 0, 1]
li:first-line { }	    [0, 1, 1]
ul li { }	            [0, 0, 2]
ul ol+li { }	            [0, 0, 3]
h1 + *[rel=up] { }          [0, 1, 1]
ul ol li.red { }	    [0, 1, 3]
li.red.level { }	    [0, 2, 1]
#li a:hover + div::before   [1, 1, 3]
```

都算出來之後，就可以比較權重了。比較各個的大小，越左邊的權重最高，高權重的如果比較有結果，後面就不用比較。

```
selectorA => [1, 0, 0]
selectorB => [0, 2, 3]
```
上面的情況，A 的第三類已經高於 B，所以 A 的優先度就比較高，所以如果選到同一個元素，那就會採用 selelctorA 的 CSS。即使 selectorB 低權重的 selector 比較多，也沒有意義。實際的例子如下
```
#submit {
    color: red 
}

main form > .check button[attr="submit"] {
    color: blue;
}
```
最後還是採用 `color: red`

那如果高權重的 selector 數量相同，像下面這種情況，就需要比較到低權重的 selector 數量，下面的情況的話 selectorC 會大於 selectorB

```
selectorB => [2, 4, 6]
selectorC => [2, 4, 8]
```

但其實還有兩個特例：

#### inline style 比任何 selector 權重更高

```
// index.html

<div style="color: red">

// style.css
div {
    color: blue
}

div {
    color: yallow
}

=> div 裡面的字是紅色的
```

所以如果延續剛剛算 selector 數量的概念，我們可以看成 [inline style, 第三類, 第二類, 第一類]

#### !important 權重最高
```
// index.html

<div style="color: red">

// style.css
div {
    color: blue !important
}

div {
    color: yallow !important
}


=> div 裡面的字是黃色的
```

不管怎麼樣有 important 最優先使用，除非後面還有 important，像是是

```
div {
    color: blue !important
}

.text {
    color: red !important
}


=> color: red
```

那才會比較後面的 selector。

所以我們可以看看最終版的權重計算
```
[
!important,
inline-style,
#id,
.class [attr] :pusedo-class ,
element :::pusedo-element
]
```

