const request = require('request');

function getList() {
  request('https://lidemy-book-store.herokuapp.com/books?_limit=10',
    (e, res, body) => {
      const result = JSON.parse(body)
        .map(ele => `${ele.id} ${ele.name}`)
        .join('\n');
      console.log(result);
    });
}

getList();
