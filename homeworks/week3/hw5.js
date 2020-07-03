var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin
});

var lines = []

// 讀取到一行，先把這一行加進去 lines 陣列，最後再一起處理
rl.on('line', function (line) {
    lines.push(line)
});

// 輸入結束，開始針對 lines 做處理
rl.on('close', function () {
    solve(lines)
})

// 上面都不用管，只需要完成這個 function 就好，可以透過 lines[i] 拿取內容

function solve(lines) {
    lines.slice(1)
        .map(e => {
            return e.split(' ')
        })
        .forEach(e => console.log(result(...e)))
}

function result(a, b, c) {
    if (c === '-1') {
        [a, b] = [b, a]
    }
    if (a.length > b.length) {
        return "A"
    } else if (a.length < b.length) {
        return "B"
    } else {
        for (let i = 0; i < a.length; i++) {
            let nA = +a[i];
            let nB = +b[i];
            if (nA > nB) return 'A'
            else if (nB > nA) return 'B'
        }
        return 'DRAW'
    }
}

