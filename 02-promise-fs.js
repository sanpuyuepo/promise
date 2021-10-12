const fs = require('fs');

// 回调形式
// fs.readFile('db.json', (err, data) => {
//     if (err) {
//         throw err;
//     }
//     console.log(JSON.parse(data));
// });


// promise 形式
let p = new Promise((resolve, reject) => {
    fs.readFile('db.json', (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    });
})

p.then( value => {
    console.log(value.toString());
}, reason => {
    console.log("path wrong!!!");
    console.log(reason);
})
