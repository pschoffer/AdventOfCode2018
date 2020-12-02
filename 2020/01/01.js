const path = require('path')
const { readFileLines } = require('../utils/file');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test.txt');

const run = async () => {
    const lines = await readFileLines(inputTestPath);
    console.log(lines);
}

run();