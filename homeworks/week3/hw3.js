/* eslint linebreak-style: 0 */
function isPrime(num) { // eslint-disable-line no-unused-vars
  if (num === 1) return false;
  for (let i = 2; i <= num; i += 1) {
    if (num % i === 0 && i !== num) {
      // console.log(i)
      return false;
    }
  }
  return true;
}

// 上面是沒查過資料的版本

// 下面看過了 https://magiclen.org/prime-number/ 再自己寫一部分的功能

function isPrime2(num) {
  // console.log(num)
  if (num === 1) return false;
  if (num === 2 || num === 3) return true;
  if (num % 2 === 0 || num % 3 === 0) { // 2, 3 的倍數都是合數 (2, 3 以外)
    return false;
  }

  const max = num ** (1 / 2);
  // console.log('max', max)
  for (let i = 1; i * 6 - 1 <= max; i += 1) { // 檢驗6n + 1, 6n + 5，最大值小於 n ** 1/2 即可
    const divisor6mod1 = i * 6 + 1;
    const divisor6mod5 = i * 6 - 1;
    // console.log(num, divisor6mod1, divisor6mod5)
    if (num % divisor6mod1 === 0 || num % divisor6mod5 === 0) {
      return false;
    }
  }

  // console.log(num, 'isPrime')
  return true;
}


function solve(lines) {
  // let nums = lines.slice(1)
  for (let i = 1; i < lines.length; i += 1) {
    const e = +lines[i];
    console.log(isPrime2(e) ? 'Prime' : 'Composite');
  }
}

solve([5, 1, 2, 3, 4, 5]);
