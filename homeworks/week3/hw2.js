/* eslint linebreak-style: 0 */
function narcissistize(str) {
  // console.log(str)
  const n = str.length;
  let sum = 0;
  for (let i = 0; i < str.length; i += 1) {
    // console.log(+str[i])
    sum += ((+str[i]) ** n);
  }

  return sum;
}

function solve(lines) { // eslint-disable-line no-unused-vars
  const input = lines[0].split(' ');
  const m = +input[0];
  const n = +input[1];
  // console.log('m', m, 'n', n)
  for (let i = m; i <= n; i += 1) {
    // console.log(narcissistize(`${i}`))
    if (narcissistize(`${i}`) === i) {
      console.log(i);
    }
  }
}

solve(['5 200']);
