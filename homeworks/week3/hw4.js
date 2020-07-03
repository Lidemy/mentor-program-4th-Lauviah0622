function solve(lines) {
    // console.log(lines)
    console.log(isPalindrome(lines[0]) ? 'True' : 'False')
}

function isPalindrome (str) {
    if (str.length === 0) return true
    return str === reverse(str)
}

function reverse(str) {
    let output = ''
    for (let i = 0; i < str.length; i++) {
        const e = str[str.length - i - 1];
        output += e
        // console.log(e)
    }
    return output
}
