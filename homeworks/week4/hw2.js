const https = require('https');
const base = 'https://lidemy-book-store.herokuapp.com';

const parsedBody = (buffer) => JSON.parse(buffer.toString('utf-8'));


(function entry() {
    let operation = process.argv[2];
    let args = process.argv.slice(3);
    // console.log(operation, args)      
    if (operation === 'list') {
        list(args)
    }
    if (operation === 'read') {
        read(args[0])
    }
    if (operation === 'delete') {
        deleteBook(args[0])
    }
    if (operation === 'create') {
        create(...args)
    }
    if (operation === 'update') {
        update(...args)
    }

})()

function list() {
    https.get(base + '/books?_limit=20', (res) => {
        res.on('data', (buffer) => {
            let rawData = parsedBody(buffer);
            let bookList = rawData.map(e => `${e.id}: ${e.name}`)
            console.log(bookList.join('\n'))

        });

    }).on('error', (e) => {
        console.error(e);
    });

}

function read(id) {
    https.get(base + '/books/' + id, (res) => {
        res.on('data', (buffer) => {
            let rawData = parsedBody(buffer);
            if (rawData.hasOwnProperty('name')) {
                console.log(`${rawData.id}: ${rawData.name}`)
                return Promise.resolve(id)
            } else {
                console.log(`can't found the book`)
                return Promise.reject(id)
            }
        })
    }).on('error', (e) => {
        console.log('read Error');
        console.log(e);
    });
};

function deleteBook(id) {
    let path = base + '/books/' + id;
    let options = {
        hostname: 'lidemy-book-store.herokuapp.com',
        port: 443,
        path: path,
        method: 'DELETE'
    }
    //     const options = {
    //   hostname: 'encrypted.google.com',
    //   port: 443,
    //   path: '/',
    //   method: 'GET'
    // };


    const req = https.request(options, (res) => {
        if (res.statusCode === 404) {
            console.log(`can not delete the book, maybe No.${id} is not exist`)
        }

        if (res.statusCode === 200) {
            console.log(`delete ${id} success!`)

            // 之後加上 確認機制，再 READ 一次書，如果成功才傳 已經刪除完畢
            // console.log(
            //     read(id)
            // )
            // .catch(e => console.log(`No.${id} has been delete`))
        }
        console.log('statusCode:', res.statusCode);
        // console.log(typeof res.statusCode)


    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();

    // const check = read(id).then(
    //     val => console.log(val),
    //     err => console.log(err)
    //     )

}

function create(name) {
    let path = base + '/books';
    let data = JSON.stringify({
        name: name
    })

    let options = {
        hostname: 'lidemy-book-store.herokuapp.com',
        port: 443,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }


    const req = https.request(options, (res) => {
        if (res.statusCode === 404) {

        }

        if (res.statusCode === 200) {
        }
        console.log('statusCode:', res.statusCode);
        // console.log(typeof res.statusCode)

        res.on('data', (buffer) => {

            // console.log('1111')
            let rawData = parsedBody(buffer);
            console.log(rawData)
        })
    })


    req.on('error', (e) => {
        console.error(e);
    });
    req.write(data)
    req.end();

}

function update(id, name) {
    let path = base + '/books/' + id;
    let data = JSON.stringify({
        name: name
    })

    let options = {
        hostname: 'lidemy-book-store.herokuapp.com',
        port: 443,
        path: path,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }


    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        // console.log(typeof res.statusCode)
    })


    req.on('error', (e) => {
        console.error(e);
    });
    req.write(data)
    req.end();
}

// 異步取得 body 的資料
/*
function getResBody (res) {
    res.on('data', (buffer) => {
        let rawData = JSON.parse(buffer.toString('utf-8'));
    }
    let rawData = JSON.parse(buffer.toString('utf-8'));
    return rawData
}
*/