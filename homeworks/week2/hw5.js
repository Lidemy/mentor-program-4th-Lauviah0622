function join(arr, concatStr) {
    if (arr.length === 0) return '';

    let output = ''
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        output += e;
        if (i !== arr.length - 1) {
            output += concatStr
        }
        // huli 的寫法是先把 str[0] 丟進去，然後逐個加上 concatStr 以及 str，比較高明阿！
    }
    return output
}


function repeat(str, times) {
    let output = ''
    for (let i = 0; i < times; i++) {
        output += str
    }

    return output
}

console.log(join(['a', 'a', 'a', 'a', 'a'], '!'));
console.log(repeat('dfdfdfdf;', 5));

console.log(repeat('123456789?', 5).split("?").join('!'))
