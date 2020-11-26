## 請列出 React 內建的所有 hook，並大概講解功能是什麼

- useState
讓 functional component 自身也可以有狀態

- useEffect
會在 functional Component render 後同步執行 callback function，適合拿來做有 side effect 的動作，像是 fetch 資料之類的

- useContext
可以用 context.provider 給的 context，Provider 可以直接傳 value 給 chilren component，不需要透過 props。

- useRef
可以儲存一個東西，這個東西可以跳脫 function 之外。可以用在 uncontroll Component

- useMemo
如果有一個需要很複雜的計算，可以把計算的 function 還有計算的 input (或者稱為 dependency )放入 useMemo，就會把 dependencies 和計算出來的 output 做 cache，節省運算時間

- useCallback
> useCallback(fn, deps) 相等於 useMemo(() => fn, deps)。

- memo 
雖然不是 hook，不過他們是三兄弟的感覺，useMemo 的 component 版，如果 props 沒變，memo 包住的 component 就不會變，不過如果有或者是 useState 或者 useContext 的話還是會 rerender。

- useLayoutEffect
useEffect 會在 virtual DOM 比對後執行，但這個時候 DOM 還沒有改變（也就是在 Paint 之前）。如果要在 Paint 之後執行的話可以用這個

- useReducer
複雜版的 useState

- useImperativeHandle
可以和 useRef 以及 React.forwardRef 搭配，讓其他人（可能是其他 component 或者是 DOM），直接使用 component 裡面的 function 或者是拿值

- useDebugValue
讓 custom hook 在被使用的時候，可以在 console 顯示說 custom hook 的狀態

Memo？

## 請列出 class component 的所有 lifecycle 的 method，並大概解釋觸發的時機點
從 lifecycle 的順序解釋

### mount 階段
當 component 完全還沒被建造出來，第一次把 component 建立起來，然後把 component 掛上去 parent Component。這個步驟稱作 mount。

1. constructor
2. render
constructor 會先被觸發後，根據 constructor 建立起一個 class，再觸發 class 裡面的 render。
3. componentDidMount
render 完之後，就會觸發 componentDidMount。



### update
1. getDerivedStateFromProps
第一次看到 XD，原來 class component 的 state 能夠預先依照 props 去做改變，然後再進 render。
2. shouldComponentDidMount
能夠透過 state 還有 props 的判斷來決定說這個 component 要不要 render，在性能優化方面感覺比 functoinal component 直覺，不過可能比較難寫
3. render
4. getSnapshotBeforeUpdate()
這個也是第一次看到，看 docs 似乎是可以拿 prevState 和 prevProps，然後可以做一些操作，像是前後的差異傳入 componentDidUpdate。不過在 functional Component 不知道有沒有對應的東西。
1. componentDidUpdate
在 state 或 props 改變後會觸發的 method，適合做 side Effect



### unmount 階段
1. componentWillUnmount
有 mount 就會有 unmount，在 Class Component當這個 component 不被需要（完全不需要，而不是更新）之後就要被 unmount 了。可以在這階段做 unsubscribe，不然會有改變不存在的 DOM ，或者是頁面已經跳轉，但還在 fetch 資料的情形。

## 請問 class component 與 function component 的差別是什麼？

自己在之前就有碰過 react，當時學的是 class Component，然後對於 life-cycle 有一些了解。看完 Lidemy 的課程之後還是這麼覺得：hooks 只是 class component lifecycle 概念的另外一種形式，只是換個形式的 API 而已，不過看了 dan 的文章之後，有不同的想法，雖然這個想法也不一定是正確的，但還是想先寫下目前的看法。


### Class Component 的 mount 還有 update
當 parent component render 到 class component 的時候，會依照 class component 的 constructor (好饒口)，來建立一個 object，並把資料存在裡面，然後再呼叫 render 來建立 virtual dom。

```js
classComponent = new ClassComponent(props) 
// 而是 classComponent 這個 object 裡面應該會是長這樣
classComponent = {
    props: props 會在 construct 的時候就被定義,
    state: state 則是只由 component 內部被決定,
    render: ...
    //...
}

classComponentVirtualDOM = classComponent.render();

parentVirtualDOM.addBranch(classComponentVirtualDOM)
// virtualDOM 以樹的方式儲存 DOM 節點
```

但是 function component 不一樣，它比 class component 直接了一點，它直接建立了 virtual DOM。看起來好像沒啥差異，如果只是單純 render 真的沒差異，但是如果有 update 事情會複雜的很多。

那如果有 update 的話，classComponent 會怎麼處理？class component 會做的是改變那個 object 裡面的值，然後再做 render，大概會是這樣。以 state 改變為例

```js
// 因為某種原因呼叫了 setState
classComponent.setState(newState)

// setState 裡面做了這些事

classComponent.state = newState // 事實上這裡是用 merge，方便起見就直接用 newState
let newClassComponentVirtualDOM = classComponent.render() 

parentVirtualDOM.replaceBranch(classComponentVirtualDOM, newClassComponentVirtualDOM)
```

### Functional Component

如果在 functino component 裡面呢？functional component 沒有 state，所以會用 useState 來處理 funcitonal component 裡面的 state 問題。如果要思考說 functional component 的 state 改變時，可能要先想，useState 的 state 是放在哪裡的。當我們在 functional component 裡面使用了 useState，會像這樣。

```js
function FunctionalComponent () {
    const [state, setState] = useState('initialValue')
    return <p>{state}</p>
}
```
然後當 FunctinoalComponent 的 parent 在 render 的時候，遇到了 FunctionalComponent 時，會做下面的事情

```js
let functionalComponentVirtualDOM = FunctionalComponent ();
parentVirtualDOM.addBranch(functionalComponentVirtualDOM)
```

在這裡我認為 useState 應該會把 state 存在某個地方，然後引用這個地方的值。這邊我也不太確定說會存在哪裡，可能存在 useState 的閉包裡面？所以我猜測第一次的 useState 本身可能會長這樣：

```js
function useState (initialValue) {
    let state = 'initialValue';
    const setState = (newState) => {
        state = newState;
        let newFunctionalComponentVirtualDOM = FunctionalComponent(props)
        parentVirtualDOM.replaceBranch(functionalComponentVirtualDOM, newFunctionalComponentVirtualDOM)
    }
    return [state, setState]
}
```

所以我們用 setState 改變了 state，整個流程和 classComponent 就有很大的不同，試著跑跑看 useState 的猜測版本

```js
setState('newState')
// 因為某些原因觸發了 setState，開始執行 setState
// 下面是 setState 內部

state = 'newState'
let newFunctionalComponentVirtualDOM = FunctionalComponent(props)

// FunctionalComponent(props) 內部，一樣會執行

const [state, setState] = useState('initialValue') // 但這時 state = 'newState'
return <p>{state}</p>

// 最後再把舊的 FunctionalComponentVirtualDOM 換掉
```

> 這裡有一個我無法解釋的點，我不知道怎麼做到跑一樣的 `useState('initialValue')`， 但卻可以給出新的 state（但這裡的 setState 應該是相同的 function），感覺有用到 generator 之類的東西？



統整一下剛剛的想法，當 class component 被第一次 render，也就是 mount 這個步驟，會是這樣：
1. 建立一個 object (也就是剛剛的 `let classComponent = new ClassComponent()`)
2. object.render() 建立 virtual DOM

然後當 state 改變（呼叫 this.setState）或者是 props 改變，也就是執行 update 這個步驟
1. object.props = newProps, object.state = newState
2. object.render()

不管是 mount 還是 update，render 用到的 state 和 props 都是 object 裡面的東西。

然後上面兩個步驟建立完 virtual DOM 之後，然後再和之前的 virutal DOM 做比對然後改變真的 DOM。

但是 function component 不一樣，第一次被 render 的時候是
1. FucntionalComonent(props)

當呼叫到 `useState()[1]`，我們平常解構出來的 setState (名子不一定)，或者是 props 改變時。一樣也是
1. FucntionalComonent(props)

props 是 parentComponent 給的，然後 state 是 useState 給的，FucntionalComonent 沒有自己的東西。

就好像幾乎可以看成 FucntionalComonent(props, useState()[0])。FunctionalComponent 這個 function 只是一個簡單的流水線而已，只管製程，不管說原料是什麼。


### 欸不是，所以到底差別是什麼？

如果要回答說 Class Component 和 Functional Component 這兩個東西到底差在哪裡，目前自己的理解是這樣

Class Component 這個 class（或者說 function，畢竟 Class 在 JS 裡面也只是個 function），是一間工廠的設計圖，外面會給原料，自己裡面也有一些自己的原料，每次生產的時候都會依照工廠內部的狀態，做一些事情（像是生產出 virtual DOM 的內容）

所以才會有[這個問題](https://codesandbox.io/s/pjqnl16lm7?file=/src/ProfilePageClass.js)，但也不能說這是問題，可能用"**特性**"會比較貼切。

Functinoal Component 就是單純的一台機器，給它 props 和 state 以及其他東西，就依照這些東西生產什麼。

還有一個不同的是 Class Component 的 componentDidMount , componentDidUpdate；和 useEffect 。

componentDidMount 和 componentDidUpdate 有點像是本身就設定好，會在特定時間執行的 method。但是 useEffect 不一樣，剛剛說道 functnioal Component 就是一台機器，而 useEffec 本身就像是個外掛一樣（不如說所有 hooks 都是外掛，不過實際上這也是被叫做 hook 的意義？）。會在特定時間（render 且 paint 後）以及特定條件（如果有設定 dependency 的話）

內容幾乎都是推測的，有點像是到目前為止對 React 運作模式的一點猜測。

## uncontrolled 跟 controlled component 差在哪邊？要用的時候通常都是如何使用？


![](https://imgur.com/j3KUxx7.jpg)


上面是 controller component，下面是 uncontrolled。

主要的差異是 controlled component 會隨時監控 & 控制 component 的 value，但 uncontrolled 只在需要的時候取值，而且無法控制 component 的 value。

目前想到的狀況會是
1. 重整之後 uncontrolled component 的 value 會不見，但 controlled component 可以想辦法把值存在 localStorage 之類的。
2. controlled component 可以做 state 的 validation，uncontrolled 的也可是可以，但是可能就要使用 formAPI 或者是透過 onchange 控制表單的 css 之類的。

controlled component 很萬能，大部分的情況都可以用他

參考資料：https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/


## React Router 背後的原理大概是怎麼實作的？(隱藏題 XD)

自己猜，應該是有一個 state 儲存 window.location，然後用 context 傳下去（應該是就是 `<Router>`？）
然後會依照 context 的 value 來做 `value === path && component` 這樣吧？


