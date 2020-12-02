const path = require('path')
const { readFileLines } = require('../utils/file');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test.txt');

const target = 2020;

const countOccurences = (input) => {
    const occurences = new Map();

    for (const item of input) {
        occurences.set(item, occurences.has(item) ? occurences.get(item) + 1 : 1);
    }
    return occurences;
}

const run = async () => {
    const lines = (await readFileLines(inputPath)).map(Number);
    const occurences = countOccurences(lines);


    let targetNumbers = [];
    for (const [number, count] of occurences) {
        const needle = target - number;
        const needleOccurences = occurences.get(needle);

        if (needleOccurences && (needleOccurences > 1 || needle !== number)) {
            targetNumbers = [number, needle];
            break;
        }
    }
    console.log(targetNumbers);
    console.log(targetNumbers[0] * targetNumbers[1]);
}

run();