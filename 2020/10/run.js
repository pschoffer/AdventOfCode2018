const path = require('path');
const array = require('../utils/array');
const { countOccurences, updateOccurences } = require('../utils/array');
const { readFileLines } = require('../utils/file');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');

const countDifferences = (items) => {
    const differences = new Map();

    let totalDiff = 0;
    for (const item of items) {
        updateOccurences(differences, item - totalDiff, 1)
        totalDiff = item;
    }

    return differences;
}

const run = async () => {
    const allAdapters = (await readFileLines(inputPath)).map(Number);

    allAdapters.sort((a, b) => a - b);

    const differences = countDifferences(allAdapters);
    updateOccurences(differences, 3, 1)

    console.log(differences, differences.get(1) * differences.get(3));
}


run();

// ------------------------------- Part 2 -------------------------------


