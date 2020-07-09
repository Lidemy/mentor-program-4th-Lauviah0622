const request = require('request');

(function searchNation() {
    const keyWord = process.argv[2];

    request('https://restcountries.eu/rest/v2/name/' + keyWord, function (error, response, body) {
        if (response.statusCode === 404) {
            console.log('找不到國家資訊')
            return 
        }
        // console.error('error:', error);
        // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode);
        // Print the response status code if a response was received
        const data = JSON.parse(body);
        let filtedData = data.map(e => {
            let { name, capital, currencies, callingCodes } = e;
            return {
                name,
                capital,
                currencies: currencies[0].code,
                callingCodes: callingCodes[0]
            }
        })
        let result = filtedData.map(e => {
            const print = `
==================
國家：${e.name}
首都：${e.capital}
貨幣：${e.currencies}
國碼：${e.callingCodes}`
            return print
        })
        console.log(result.join(''));
        // Print the HTML for the Google homepage.
    });
}) ()