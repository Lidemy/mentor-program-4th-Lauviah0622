const https = require('https');

const base = 'https://lidemy-book-store.herokuapp.com';
const parsedBody = buffer => JSON.parse(buffer.toString('utf-8'));

function list() {
  https.get(`${base}/books?_limit=20`, (res) => {
    res.on('data', (buffer) => {
      const rawData = parsedBody(buffer);
      const bookList = rawData.map(e => `${e.id}: ${e.name}`);
      console.log(bookList.join('\n'));
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

function read(id) {
  https.get(`${base}/books/${id}`, (res) => {
    res.on('data', (buffer) => {
      const rawData = parsedBody(buffer);
      if (rawData.prototype.hasOwnProperty.call(undefined, 'name')) {
        console.log(`${rawData.id}: ${rawData.name}`);
        return Promise.resolve(id);
      }
      console.log('can\'t found the book');
      return Promise.reject(id);
    });
  }).on('error', (e) => {
    console.log('read Error');
    console.log(e);
  });
}

function deleteBook(id) {
  const path = `${base}/books/${id}`;
  const options = {
    hostname: 'lidemy-book-store.herokuapp.com',
    port: 443,
    path,
    method: 'DELETE',
  };

  const req = https.request(options, (res) => {
    if (res.statusCode >= 400) {
      console.log(`can not delete the book, maybe No.${id} is not exist`);
    }

    if (res.statusCode < 300 && res.statusCode >= 200) {
      console.log(`delete ${id} success!`);
    }
    console.log('statusCode:', res.statusCode);
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

function create(name) {
  const path = `${base}/books`;
  const data = JSON.stringify({
    name,
  });

  const options = {
    hostname: 'lidemy-book-store.herokuapp.com',
    port: 443,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };


  const req = https.request(options, (res) => {
    // if (res.statusCode > 400) {

    // }

    // if (res.statusCode >= 200 && res.statusCode < 400) {
    // }
    console.log('statusCode:', res.statusCode);

    res.on('data', (buffer) => {
      const rawData = parsedBody(buffer);
      console.log(rawData);
    });
  });


  req.on('error', (e) => {
    console.error(e);
  });
  req.write(data);
  req.end();
}

function update(id, name) {
  const path = `${base}/books/${id}`;
  const data = JSON.stringify({
    name,
  });

  const options = {
    hostname: 'lidemy-book-store.herokuapp.com',
    port: 443,
    path,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
  });


  req.on('error', (e) => {
    console.error(e);
  });
  req.write(data);
  req.end();
}


(function entry() {
  const operation = process.argv[2];
  const args = process.argv.slice(3);
  if (operation === 'list') {
    list(args);
  }
  if (operation === 'read') {
    read(args[0]);
  }
  if (operation === 'delete') {
    deleteBook(args[0]);
  }
  if (operation === 'create') {
    create(...args);
  }
  if (operation === 'update') {
    update(...args);
  }
}());
