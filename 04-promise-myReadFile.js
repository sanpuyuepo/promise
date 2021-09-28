

function myReadFile(path) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

myReadFile('db.json').then((value) => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
})