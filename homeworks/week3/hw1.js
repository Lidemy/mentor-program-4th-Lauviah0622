function solve(line) {
  console.log(star2(+line[0]))
}


function star(n) {
  let result = '';
  let str = '';
  for (let i = 1; i <= n; i++) {
    str += '*'
    result = result + str + '\n'
  }
  return result

}

function star2(n) {
  return new Array(n - 1).fill('').map((e, i) => '*'.repeat(i + 1)).join('\n')
}

// solve([10])
