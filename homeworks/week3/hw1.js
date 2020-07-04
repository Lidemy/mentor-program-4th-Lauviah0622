function star2(n) {
  return new Array(n - 1).fill('').map((e, i) => '*'.repeat(i + 1)).join('\n');
}

function star(n) { // eslint-disable-line no-unused-vars
  let result = '';
  let str = '';
  for (let i = 1; i <= n; i + 1) {
    str += '*';
    result = `${result}${str}\n`;
  }
  return result;
}
function solve(line) {
  console.log(star2(+line[0]));
}
solve([10]);
