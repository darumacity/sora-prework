'use strict';

module.exports.writeFile = (value) => {
    var fs = require('fs');

    if (!fs.existsSync('../data')) {
        fs.mkdirSync('../data');
    }

    fs.writeFile('../data/201907.json', JSON.stringify(value), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('success');
        }
    })
}
