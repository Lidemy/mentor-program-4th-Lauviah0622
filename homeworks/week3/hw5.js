function result(a, b, c) {
  if (c === '-1') {
    [a, b] = [b, a] // eslint-disable-line
  }
  if (a.length > b.length) {
    return 'A';
  }
  if (a.length < b.length) {
    return 'B';
  }
  for (let i = 0; i < a.length; i + 1) {
    const nA = +a[i];
    const nB = +b[i];
    if (nA > nB) return 'A';
    if (nB > nA) return 'B';
  }
  return 'DRAW';
}

function solve(lines) {
  lines.slice(1)
    .map(e => e.split(' '))
    .forEach(e => console.log(result(...e)));
}

solve(['3', '1 2 1', '1 2 -1', '2 2 1']);
