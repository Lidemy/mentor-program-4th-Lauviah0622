## 這週學了一大堆以前搞不懂的東西，你有變得更懂了嗎？請寫下你的心得。

記得之前下很多功夫在這一部份，花了蠻長的時間的，那個時候大部分是看 [JSinfo](https://javascript.info/)，這份的內容講得很清楚，而且內容很豐富！幾乎 JS 的各個面向都有提到（這部分很推）。但在深淺沒有分得很清楚，如果初學者照著上面一篇一篇看下去（當時的我），會很快就被壓死...

可能也是因為這樣，所以之前一直以為這是一個很大的部分，而且很難。一開始覺得這部分只花一個禮拜就講完自己還蠻驚訝的，不過看完之後好像也差不多。不過這部分覺得可以說是是深入 JS 的第一步，講複雜還蠻複雜的，但是之後還有更複雜的東西XD。

這章自己會分五個部分

1. event loop
1. 變數的賦值 & 宣告 (Hoisting 是宣告的機制之一)
1. 變數的作用域(Scope) 
1. funciton 的 scopechain (closure)
1. Prototype

但是其實 2. 3. 4. 是一個大的整體的概念。話說在進到這章以前真的很建議說可以複習一下之前 Huli 博物館模型的那張圖，複習還有延續之前的觀念。

自己在看完這個部分之後還是很多問題，覺得 Execution context,  scope, 還有 callstack 這些東西，應該可以整合成一個大概念，然後這些概念又可以跟 week15 的瀏覽器運作整合再一起，變成整個前端底層運作的大概念。

But 可能要把 Standard 看熟一點才有辦法整合了。現在自己連 huli 的文章都還沒看阿...現在的感覺就像拿到半包拼圖，有些東西可以拼起來，有些東西不行，但是拼圖的數量其實已經大概看得出圖案是甚麼。這種感覺挺彆扭的。

### 自我檢測
想說試著回答自我檢測看看，當個小複習。

- [ ] P1 你知道 Event Loop 的運作方式

在瀏覽器（其實其他 runtime 像是 node 也是用類似的機制），有一些是 webapi（run time 給的 api），並不屬於 V8 本身（更準確的定義應該是不在 ECMAscript 的標準裡面）。那這些事件就會先透過 runtime 本身的機制自己先處理過後，在將接續需要執行的 callback function 丟到 callback queue 之後，等 callstack 的內容都執行完了之後，再一個一個把 callback function 丟進去 callstack 執行。



- [ ] P1 你知道什麼是作用域（Scope）

變數只能在作用域裡面作用，外層不能存取內層，但是內層可以存取外層。

❓ 不過這裡有一個疑惑是，Scope 跟 Execution context 中的 VO 是一個概念嗎？還有因為 scope 還有 block scope，所以其實 for, 跟 if 也會建立一個 EC，所以才會有一個 block 的 scope。原本很想問這個問題，可是後來覺得說 ECMAsciprt 的 statdard 裡面應該有，就有點不好意思問...

- [ ] P1 你知道 Hoisting（提升）是什麼
- [ ] P1 你知道 Hoisting 的原理為何

原因是一個作用域的裡面變數宣告的順序有關：
1. 先是 argument
2. 在來是 function，但是可以替代掉 argument
3. var, let, const
let 跟 const 在被賦值前不能被存取 (TDZ)

因為這樣子，就會導致說我們平常認知的 Hoisting 會是這樣：
1.  function 的宣告最先
2. 再來是 function 的 argument
3. var, let ,const
不過其實是 function 可以取代的關係，不過好像知道也沒有甚麼大差異就是了

- [ ] P1 你知道 Closure（閉包）是什麼

你外層 scope 的 EC 已經結束，但是 VO 卻還是被保留在 scope Chain。讓你覺得為什麼明明都執行完了，scope 裡的變數還存在的一種 JS 之神奇現象。

- [ ] P1 你能夠舉出一個運用 Closure 的例子

debounce, throttle, memeory
其實上面都是 function 的 decorator，運用 closure 可以幫 function 加上功能而不影響原有的 function。React 裡面有一種 higher order Component 也是這個概念。用起來的基本架構好像是這樣？

```js

function decorator (fn) {
    // 要藏起來的參數或者 method
    return function (args)  {
        // 邏輯判斷丟這邊

        // 最後一要求執行 fn 或者是給對應的值，總之要跟原本的 fn 執行起來一模一樣
        return fn(args)
    }
}
```

- [ ] P1 你知道 Prototype 在 JavaScript 裡是什麼

一個神奇的空間，你可以放入你的家產~~遺產~~。然後你的子子孫孫都可以使用。

- [ ] P1 你知道大部分情況下 this 的值是什麼

1. 先判斷是不是 arrow fucntion
    - arrow function：
    是的話，arrow function 沒有 this，所以你要從 arrow function 的 scopechain 裡面找有沒有 this，跟找變數一模一樣
    - function ()：不是就不是，繼續下去

2. 再判斷說是不是 method
    - 是：的話就是你的 object 本身
    - 不是：會回傳 global object，如果是嚴格模式就會是 undefined
3. 是不是 DOM event callback 
    - 是：event target

❓ 這裡覺得 JS201 影片裡面講的 this 有點怪怪的，裡面有講到這個例子
```
class Test {
    runthis () {
        console.log('run this', this);
        setTimeout(() => {
            console.log(this);
        }, 100)
    }
}

let t = new Test();

t.runthis() //Test {}
```

影片裡面是提到，箭頭函式的 this 會跟 `console.log('run this', this)` 這個值相同，箭頭函式的 this 會跟定義在哪裡有關係。不過如果試試下面的 Case

```
let obj = {
    inner: {
        test: () => {
            console.log(this);
        }
    },
    a: 10
}

obj.inner.test(); // 在 node 裡面跑是{}，在 chrome 是 window
```
this 就不會指向 obj 也不會指向 inner。這個裡就覺得有點奇怪

自己的看法是，第一個 case 是因為 arrow function 在 runthis 這個 function 裡面，所以 `console.log('run this', this)` 會指向 t 這個 object。因為 arrow function 沒有 this，所以會像普通的變數一樣從 scopechain 上去找，所以找到了 runthis 裡面的 this。

第二個 case 因為 object 沒有 scope，所以就會跑出奇怪的東西（也就是在非 method 情況下的 this），為了驗證這個情況，在用下面這個東西來 trytry 看。

```js
let obj = {
    inner: {
        test: () => {
            return this
        }
    },
    a: 10
}

function clg_this() {
    return this
} 

let a = obj.inner.test();
let b = clg_this();
console.log(a === b); // node: false   chrome: true
```

在想說 node 的機制可能跟 chrome 不太一樣。所以也不知道正不正確，想問問助教們還有老師的看法。


- [ ] P2 你知道物件導向的基本概念（類別、實體、繼承、封裝）

類別 class：創造一個 class 的模板
實體 instance：模板建造出來的成品
繼承 inherit：模板有的東西，成品都有。改模板，成品上的東西也會跟著改動
封裝 ：只提供 API（其實就是一些暴露在外的 method），來控制物件內部的屬性，而不會讓你從外部任意存取。就像你只能透過搖桿跟按鈕控制爪子來夾娃娃，不能直接打開玻璃窗把娃娃拿出來的概念。

其實覺得 JS 實現物件導向這個設計還蠻妙的，雖然有些人可能嘴說這不是真正的物件導向。但是身為 JS native 的我覺得這個設計之精妙小弟甘拜下風。

一些古老的語言有所謂的物件導向，久而久之習慣這個模式，當然這個模式也有它的優點，才這樣被保留下來。不過如果能用更簡單的方法就做到類似的功能覺得也沒甚麼不好。不過當然有捨有得，JS 這樣的實現模式可能就沒辦法做到 Java 或者是其他語言物件導向的一些功能。像是 JS 好像就沒辦法用比較簡單的方式來做到多繼承（不過 Java 也不行？），JS 這個方法已經變成跟傳統的繼承相比已經算是另外一種繼承了([prototype-base inherit](https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%9E%8B%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88))。

不過比其他語言，我們只是會需要一點奇技淫巧來做到相同的功能而已，反正這不是前端的宿命嗎(?)。

## 其他問題

對於 for loop 中 var 的 scope 自己可以理解，但是如果是用 let 就難理解很多了。

```js
function test1() {
    let arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = () => {
            console.log(i)
        }
    }
}
```
這個是 var 的情形，那 EC 還有 VO 的圖會像這樣
```
test1 {
    var i = 0
    arr[0] = console.log(i);
    i = 1
    arr[1] = console.log(i);
    i = 2
    arr[2] = console.log(i);
    i = 3
    arr[3] = console.log(i);
    i = 4
    arr[4] = console.log(i);
    i = 5
    arr[5] = console.log(i);
    ...
}
```
所以才會有 log 出來全部都是 `5` 的狀況。

但這裡有個問題，因為在 test1 也不能存取 i，所以會比較像這樣？

```
test1 {
    forloop {
        var i = 0
        arr[0] = console.log(i);
        i = 1
        arr[1] = console.log(i);
        i = 2
        arr[2] = console.log(i);
        i = 3
        arr[3] = console.log(i);
        ...
    }
}
```

如果是 let：

```js
function test2() {
    for (let i = 0; i < 10; i++) {
        // console.log(i);
        arr[i] = () => {
            console.log(i)
        }
    }
}
test2()
```
自己的理解會像這樣。
```
test2{
    for loop{
        var i = 0
        {
            let i = loop.i = 0
            arr[i] = console.log(i);
        }
        i = 1
        {
            let i = loop.i = 1
            arr[i] = console.log(i);
        }
        i = 2
        {
            let i = loop.i = 2
            arr[i] = console.log(i);
        }
        i = 3
        {
            let i = loop.i = 3
            arr[i] = console.log(i);
        }
        ...
    }
}
```
這裡是一個不太確定的部分，因為 let 是 block scope。所以只要 loop 執行一次，就會建立一個 scope，並把值複製進來？

不過這樣也不太合理就對了...怎麼可能因為 var 跟 let 就改變 for loop 的運作方式。

所以想說 var loop 應該會是這樣？
```
test1 {
    forloop {
        iterator = 0
        var i = iterator 
        {
            arr[0] = console.log(i);
        }
        iterator = 1
        i = iterator = 1
        {
           arr[1] = console.log(i);
        }
        iterator = 2
        i = iterator = 2
        {
            arr[2] = console.log(i);
        }
        iterator = 3
        i = iterator = 3
        {
            arr[3] = console.log(i);
        }
        ...
    }
}
```

上面囉嗦一堆其實結論應該是這樣？
了

1. for loop 本身也是一個 function scope  
    => 因為外層存取不到 for 裡面的變數
1. block scope 原本就存在，但是 var 這個宣告方式會忽略 block scope，直接宣告在 function scope 裡面，但是 let 就會宣告在 block scope 裡面  
=> 這裡比較像猜測，因為先有 var，但是因為 let 跟 const 而後來建立一個 block scope 有點奇怪。

3. for loop 本身有一個 iterator，然後會把值複製進去？  
=> 這裡我也覺得很不合理，可是如果不是這樣的話 var 跟 let 在 for loop 的運作方式會不一樣。




