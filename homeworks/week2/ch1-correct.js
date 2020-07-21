function search(arr, n) {
  let r = arr.length - 1;
  let l = 0;
  let centerInd = Math.ceil((r + l) / 2);
  while ((r - l) > 1) { // 如果相差 1 表示他們之間沒數字 => 不在裡面
    console.log(centerInd);
    if (arr[centerInd] > n) {
      r = centerInd;
    } else if (arr[centerInd] < n) {
      l = centerInd;
    } else {
      return true;
    }
    centerInd = Math.ceil((r + l) / 2);
  }
  return false;
}

console.log(search([1, 3, 10, 39, 100, 1000, 10000, 100000], 6));
