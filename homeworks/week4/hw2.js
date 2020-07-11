const https = require('https');

const base = 'https://lidemy-book-store.herokuapp.com';
const parsedBody = buffer => JSON.parse(buffer.toString('utf-8'));
const getHeader = (method, path, data) => (
  {
    hostname: 'lidemy-book-store.herokuapp.com',
    port: 443,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  }
);

function list(num) {
  https.get(`${base}/books?_limit=${num}`, (res) => {
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
    console.log(res.statusCode);
    res.on('data', (buffer) => {
      const rawData = parsedBody(buffer);
      if (rawData.hasOwnProperty('name')) { //eslint-disable-line
        console.log(`#${rawData.id}: ${rawData.name}`);
      } else {
        console.log(`can't found the book #${id}`);
      }
    });
  }).on('error', (e) => {
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

  const options = getHeader('POST', path, data);

  const req = https.request(options, (res) => {
    if (res.statusCode > 400) {
      console.log('something getting wrong in adding new book');
    }

    if (res.statusCode >= 200 && res.statusCode < 400) {
      // console.log('statusCode:', res.statusCode);

      res.on('data', (buffer) => {
        const rawData = parsedBody(buffer);
        console.log(`add book success！ Your book "${rawData.name}" is #${rawData.id}`);
      });
    }
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

  const options = getHeader('PATCH', path, data);
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
  const args = process.argv.slice(3, 4);
  if (operation === 'list') {
    list(args.length === 0 ? 20 : args);
  } else if (operation === 'read') {
    read(args[0]);
  } else if (operation === 'delete') {
    deleteBook(args[0]);
  } else if (operation === 'create') {
    create(...args);
  } else if (operation === 'update') {
    update(...args);
  } else {
    console.log(`
you command get something wrong, following info can help you

print book list   : node <filename> list
print single book : node <filename> read <:id>
delete book       : node <filename> delete <:id>
create new book   : node <filename> create <:new book name>
update book name  : node <filename> update <:id> <:new name>
`);
  }
}());
