function solve(lines) {
    let input = lines[0].split(' ');
    let m = +input[0];
    let n = +input[1];
    // console.log('m', m, 'n', n)
    for (let i = m; i <= n; i++ ) {
        // console.log(narcissistize(`${i}`))
        if (narcissistize(`${i}`) === i) {
            console.log(i)
        }
    }
}

function narcissistize(str) {
    // console.log(str)
    let n = str.length
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        // console.log(+str[i])
        sum += ((+str[i]) ** n)
    }

    return sum
}
