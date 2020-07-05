/* eslint linebreak-style: 0 */
const x = '124902814902890825902840917490127902791247902479027210970941724092174091274902749012740921759037590347438758957283947234273942304239403274093275902375902374092410937290371093719023729103790123';
const y = '1239128192048129048129021830918209318239018239018239018249082490182490182903182390128390128903182309812093812093820938190380192381029380192381092380192380123802913810381203';

function transToNumArr(str) {
  // console.log(str)
  return str.split('').reverse();
}

function getProductArray(arr1, arr2) {
  const product = [];

  arr1.forEach((numA, i) => {
    arr2.forEach((numB, j) => {
      const mul = +numA * +numB;
      // console.log('no', i + j, '=>', mul)
      if (!product[i + j]) {
        product[i + j] = [mul];
      } else {
        product[i + j].push(mul);
      }
      // console.log(mul)
    });
  });
  return product;
}

function carryDigit(arr) {
  const copyArr = [...arr];
  // console.log(123123)
  for (let i = 0; i < copyArr.length; i += 1) {
    const digitArr = copyArr[i];
    // console.log(digitArr)
    for (let j = 0; j < digitArr.length; j += 1) {
      const digEle = digitArr[j];
      const carryNum = Math.floor(digEle / 10);
      const unitDig = digEle % 10;
      if (carryNum) {
        // console.log(true)
        digitArr[j] = unitDig;
        if (copyArr[i + 1]) {
          copyArr[i + 1].push(carryNum);
        } else {
          copyArr[i + 1] = [carryNum];
        }
      }
      // console.log(i, ':', carryNum, unitDig)
    }
  }
  // console.log(copyArr)
  return copyArr;
}


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
