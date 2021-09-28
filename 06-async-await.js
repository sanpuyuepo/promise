const fs = require('fs');
const util = require('util');

const myReadFile = util.promisify(fs.readFile);

// 回调函数
// fs.readFile('./db.json', (err, data1) => {
//     if (err) {
//         throw err;
//     };
//     fs.readFile('./test.html', (err, data2) => {
//         if (err) {
//             throw err;
//         }
//         console.log(data1 + data2);
//     })
// })

// 异步函数
// async function foo() {

//     try {
//         let data1 = await myReadFile('./db.json');
//         let data2 = await myReadFile('./test.html');
    
//         console.log(data1 + data2);
//     } catch (error) {
//         console.log(error);
//     }
// }

// foo();

