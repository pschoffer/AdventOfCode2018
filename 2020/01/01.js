const path = require('path');
const { countOccurences, fitInOccurences } = require('../utils/array');
const { readFileLines } = require('../utils/file');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test.txt');

const target = 2020;


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

// run();

// ------------------------------- Part 2 -------------------------------



const run2 = async () => {
    const lines = (await readFileLines(inputPath)).map(Number);
    const occurences = countOccurences(lines);


    let targetNumbers = [];
    for (const [number] of occurences) {
        const subTarget = target - number;
        for (const [number2] of occurences) {
            const needle = subTarget - number2;
            const candidates = [number, number2, needle];
            if (fitInOccurences(candidates, occurences)) {
                targetNumbers = candidates;
                break;
            }
        }
    }
    console.log(targetNumbers);
    console.log(targetNumbers.reduce((prev, curr) => prev * curr, 1))
}

run2();