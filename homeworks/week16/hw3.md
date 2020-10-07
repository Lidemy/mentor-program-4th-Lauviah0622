```js
var a = 1           
function fn(){
  console.log(a)  // 1. ud; var a 先被 hoisting
  var a = 5
  console.log(a)  // 2. 5
  a++
  var a
  fn2()
  console.log(a)  // 4. 20; 被 fn2 裡面的值
  function fn2(){
    console.log(a) // 3. 6
    a = 20   // 自己沒有 a，用 fn VO 裡面的 a
    b = 100  // 沒有宣告就賦值，所以先在 global VO 宣告
  }
}
fn()
console.log(a)  // 5. 1
a = 10
console.log(a) // 6. 10
console.log(b) // 7. 100; fn2 裡面的 b = 100  在 global 宣告
```