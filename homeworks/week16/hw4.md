```js
const obj = {
  value: 1,
  hello: function() {
    console.log(this.value)
  },
  inner: {
    value: 2,
    hello: function() {
      console.log(this.value)
    }
  }
}
  
const obj2 = obj.inner
const hello = obj.inner.hello
obj.inner.hello() // 2
obj2.hello() // 2
hello() // undefined
```


可以看成這樣

```
const obj2 = {
    value: 2,
    hello: function() {
      console.log(this.value)
    }
}
// 跟 obj.inner 是指向同一個 obj

const hello = function() {
    console.log(this.value)
}
// 跟 obj.inner.hello 是指向同一個 function

obj.inner.hello() 
// 是 obj.inner 的 method，所以 this 指向 obj.inner
obj2.hello() // 2
// 是 obj2 的 method，所以 this 指向 obj2
hello()
// 不是任何物件的 method，所以指向 global，但是 global 沒有 value 這個 property，所以是 undefined
```