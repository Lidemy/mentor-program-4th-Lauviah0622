## 為什麼我們需要 Redux？
自己目前 Redux 用起來，比較像是把四散各地的 state 集中一起管理的感覺。在原本的狀態四散各地，然後又有各種不同的方式來操作 state（state 基本上就是前端的 model？），這麼多錯綜複雜的 state 還是集中管理的好，於是我們就發明了一種架構來集中管理 state，就是 flux。

但是有架構還不太夠，需要有一個 library 來實踐這個架構，讓我們使用，Redux 就是 Flux 的其中一種實踐。



## Redux 是什麼？可以簡介一下 Redux 的各個元件跟資料流嗎？

Redux 是一個管理狀態的 library，利用 flux 的架構來管理 API。

這個概念有點像是你平常沒怎麼在管理時間，你覺得很糟生活很亂，於是有一天你聽到了一個東西叫做蕃茄鐘工作法，於是你就下載一個 APP 來幫你實踐蕃茄鐘工作法。

蕃茄鐘工作法就是 flux 這個架構，或者說一個方法，你下載的 APP 就相當於 Redux，所以你也可以不用 redux 來實踐 flux，純手工也沒有問題。

在 Redux 有幾個不同的元件：

- store：當我們把很多 state 放在一起統一管理，我們稱作為 store
- Reducer：控制 store 的東西，稱作為 reducer
- action：一個指令，它會被拿來通知 Reducer 去做事情
- dispatch：一個指令的發送器


![](https://imgur.com/0Gbswff.jpg)

## 該怎麼把 React 跟 Redux 串起來？

好像只需要把 store 和 dispatch 放入 context 就好了。

事實上 react-redux 做的事情好像也差不多
```js
// index.js
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
```

```js
// App.js
import { getTodosState } from "./redux/selectors";
import { addTodo } from "./redux/actions";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const todos = useSelector(getTodosState);
  return (
    <div>
      <AddTodo/>
      <ul>
        {todos.map(todo => <li>{todo.name}</li>)}
      </ul>
    </div>
  );
}
```

會建立一個 redux 的資料夾和 react 本身沒有關係，只是為了好整理而已。Provider 應該是 Context 的包裝，useDispatch 還有 useSelector 則是用 useContext 包起來。舊版的 connect 應該也是用 Context.Consumer 包裝起來吧我想，用 HOC 把 dispatch 還有 store props 傳下去。






