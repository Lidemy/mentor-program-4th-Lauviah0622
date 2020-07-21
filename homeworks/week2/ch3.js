/* eslint linebreak-style: 0 */
const x = '124902814902890825902840917490127902791247902479027210970941724092174091274902749012740921759037590347438758957283947234273942304239403274093275902375902374092410937290371093719023729103790123';
const y = '1239128192048129048129021830918209318239018239018239018249082490182490182903182390128390128903182309812093812093820938190380192381029380192381092380192380123802913810381203';

function transToNumArr(str) {
  // console.log(str)
  return str.split('').reverse();
}


// 把兩個大數的每一位數乘以每一位數，先儲存在 array 裡面
function getProductArray(arr1, arr2) {
  const product = [];
  arr1.forEach((numA, i) => {
    arr2.forEach((numB, j) => {
      const mul = +numA * +numB; // 先把數字乘出來
      product[i + j] = product[i + j] ? [...product[i + j], mul] : [mul];
    });
  });
  return product;
}

// 處理進位問題，例如：[[1], [21], [123]] 把超過十位數的進位 => [[1, 2, 1], [1, 3], [3]]
function carryDigit(arr) {
  const copyArr = [...arr];
  for (let i = 0; i < copyArr.length; i += 1) {
    const digitArr = copyArr[i];
    for (let j = 0; j < digitArr.length; j += 1) {
      const digEle = digitArr[j];
      const carryNum = Math.floor(digEle / 10);
      const unitDig = digEle % 10;
      if (carryNum) {
        digitArr[j] = unitDig;
        if (copyArr[i + 1]) {
          copyArr[i + 1].push(carryNum);
        } else {
          copyArr[i + 1] = [carryNum];
        }
      }
    }
  }
  return copyArr;
}

// 各個位數相加 [[1, 2, 1], [1, 3], [3]] => [4, 4, 3]
function sumDigit(arr) {
  const result = arr.map(digArr => digArr.reduce((acc, e) => acc + e, 0));
  for (let i = 0; i < result.length; i += 1) {
    const digEle = result[i];
    const carryNum = Math.floor(digEle / 10);
    const unitDig = digEle % 10;
    if (carryNum) {
      result[i] = unitDig;
      result[i + 1] += carryNum;
    }
  }
  return result;
}


function multiply(a, b) {
  const numArrA = transToNumArr(a);
  const numArrB = transToNumArr(b);
  // console.log(numArrA, numArrB)
  const productArr = getProductArray(numArrA, numArrB);
  // console.log(productArr)
  const carryArr = carryDigit(productArr);
  // console.log(carryArr)
  const sumDigitArr = sumDigit(carryArr);

  return sumDigitArr.reverse().join('');
}

console.log(multiply(x, y) === String(BigInt(x) * BigInt(y)));// eslint-disable-line no-undef
