/* eslint-disable */
function search(arr, n) {
    if (arr.length <= 0 ) {
        return false
    } else if (arr.length === 1) {
        return arr[0] === n
    } else {
        let centerNum = 0
        let sliceArr = []
        if (arr.length % 2 === 1) {
            // odd
            centerInd = (arr.length - 1) / 2
            centerNum = arr[centerInd];
            if (centerNum < n) {
                sliceArr = arr.slice(centerInd + 1)
            } else if (centerNum > n) {
                sliceArr = arr.slice(0, centerInd)
            } else {
                return true
            }
        } else {
            // even
            centerNum = (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2;
            if (centerNum < n) {
                sliceArr = arr.slice(arr.length / 2)
            } else if (centerNum > n) {
                sliceArr = arr.slice(0, arr.length / 2 - 1)
            }
        }
        return search(sliceArr, n)

    }
}

function judgeArr(arr, n) {

}


function getMidInd(arr) {
    const arrLeng = arr.length;
    return Math.floor(arrLeng / 2)
}

console.log(search([1, 3, 10, 39, 100, 1000, 10000, 100000], 10))

