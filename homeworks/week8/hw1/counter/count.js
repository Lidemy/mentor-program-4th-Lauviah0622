let https = require('https');
// console.log(https);
const url = 'https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery';
let arr = [];
const TRIES = 100;

(function () {https.get(url, function call(res) {
    // console.log('headers:', res.headers);
    console.log('statusCode:', res.statusCode);
    if (res.statusCode < 200 || res.statusCode >= 400) {
        https.get(url, call)
    }
    res.on('data', (d) => {
        console.log(arr.length)
        let str = d.toString('utf8');
        try {
            var content = JSON.parse(str);
            
        } catch (e) {
            console.log(e)
        }
        console.log(content.prize)
        if (arr.length < TRIES) {
            arr.push(content.prize);
            // console.log(arr)
            https.get(url, call)
        } else {
            let sum = arr.reduce((acc, ele) => {
                // console.log(ele)
                if (!acc.hasOwnProperty(ele)) {
                    acc[ele] = 0;
                }
                acc[ele] += 1;
                return acc
            }, {})
            const ans = Object.entries(sum).map(([key, value]) => `${key}: ${value / TRIES}`)
            console.log(ans)
        }
    });
}).on('error', (e) => {
    console.error('Error', e);
  });
}())
