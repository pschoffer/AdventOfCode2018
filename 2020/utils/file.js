const fs = require('fs');



const readline = require('readline');

const readFileLines = async (path) => {

    return new Promise((resolve) => {

        const lines = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(path),
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            lines.push(line)
        });
        rl.on('close', () => resolve(lines));
    });

}


module.exports = {
    readFileLines
}