// eslint disable indent: 0
const request = require('request');

(function searchNation() {
  const keyWord = process.argv[2];

  request(`https://restcountries.eu/rest/v2/name/${keyWord}`,
    (error, response, body) => {
      if (response.statusCode > 400) {
        console.log('找不到國家資訊');
        return;
      }
      const data = JSON.parse(body)
        .map(e => `
==================
國家：${e.name}
首都：${e.capital}
貨幣：${e.currencies}
國碼：${e.callingCodes}`)
        .join('');
      console.log(data);
    });
}());
