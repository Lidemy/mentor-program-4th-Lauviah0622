const x = '25';
const y = '25';

function multiply(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < a.length; j += 1) {
      const mulDig = i + j;

      result[mulDig] = result[mulDig] || 0;
      const mul = a[a.length - 1 - i] * b[b.length - 1 - j] + result[mulDig];

      if (mul >= 10) {
        result[mulDig] = (mul % 10);
        result[mulDig + 1] = result[mulDig + 1] || 0;
        result[mulDig + 1] += Math.floor(mul / 10);
      } else {
        result[mulDig] = mul;
      }
    }
  }
  return result.reverse();
}
console.log(multiply(x, y).join(''));
