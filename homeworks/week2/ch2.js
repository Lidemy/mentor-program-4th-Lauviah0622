/* eslint no-bitwise: 1,  linebreak-style: 0 */
const x = 100;
const y = 100000;

function add(a, b) {
  const xor = a ^ b; // 不用進位的結果
  const and = (a & b) << 1; // 需要進位的位數的結果;
  console.log('add');
  console.log('a ^ b', xor);
  console.log('a & b', and);
  if ((xor & and) === 0) { // 有沒有需要再進位
    console.log('ans', xor | and);
    // return xor | and
  } else {
    add(xor, and); // 不用進位的位數 + 進位過的數字
  }
}


add(x, y);
