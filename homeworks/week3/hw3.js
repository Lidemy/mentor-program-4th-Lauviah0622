var readline = require('readline');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
var rl = readline.createInterface({
  input: process.stdin
});

var lines = []

// 讀取到一行，先把這一行加進去 lines 陣列，最後再一起處理
rl.on('line', function (line) {
  lines.push(line)
});

// 輸入結束，開始針對 lines 做處理
rl.on('close', function() {
  solve(lines)
})

// 上面都不用管，只需要完成這個 function 就好，可以透過 lines[i] 拿取內容

function solve(lines) {
    // let nums = lines.slice(1)
    for (let i = 1; i < lines.length; i++) {
        const e = +lines[i];
        // console.log(e)
        // isPrime2(e)
        console.log(isPrime2(e) ? 'Prime': 'Composite')
    }

}

function isPrime(num) {
    if (num === 1) return false
    for (let i = 2; i <= num; i++) {
        if (num % i === 0 && i !== num) {
            // console.log(i)
            return false
        }
    }
    return true
}


//上面是沒查過資料的版本

//下面看過了 https://magiclen.org/prime-number/ 再自己寫

function isPrime2(num) {
    // console.log(num)
    if (num === 1 ) return false
    if (num === 2 || num === 3) return true
    if (num % 2 === 0 || num % 3 === 0) { // 2 的倍數都是合數 (2 以外)
        return false
    } else {
        let max = num ** (1/2);
        // console.log('max', max)
        for (let i = 1; i * 6 - 1 <= max; i++) { //檢驗6n + 1, 6n + 5，最大值小於 n ** 1/2 即可
            let divisor6mod1 = i * 6 + 1;
            let divisor6mod5 = i * 6 - 1;
            // console.log(num, divisor6mod1, divisor6mod5)
            if (num % divisor6mod1 === 0 || num % divisor6mod5 === 0) {
                return false
            }
                
        }

    }
    // console.log(num, 'isPrime')
    return true
}
