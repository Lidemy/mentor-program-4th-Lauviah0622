const request = require('request');

(function searchNation() {
  const keyWord = process.argv[2];

  request(`https://restcountries.eu/rest/v2/name/${keyWord}`,
    (error, response, body) => {
      if (response.statusCode > 400) {
        console.log('找不到國家資訊');
        return;
      }
      const data = JSON.parse(body);
      const filtedData = data.map((e) => {
        const {
          name,
          capital,
          currencies,
          callingCodes,
        } = e;
        return {
          name,
          capital,
          currencies: currencies[0].code,
          callingCodes: callingCodes[0],
        };
      });
      const result = filtedData.map((e) => {
        const print = `
==================
國家：${e.name}
首都：${e.capital}
貨幣：${e.currencies}
國碼：${e.callingCodes}`;
        return print;
      });
      console.log(result.join(''));
    });
}());
