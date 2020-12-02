const path = require('path');
const { countOccurences, fitInOccurences } = require('../utils/array');
const { readFileLines } = require('../utils/file');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const parseLine = (line) => {
    const [policy, passwordPart] = line.split(':');
    const password = passwordPart.substring(1);

    const [rangeStr, char] = policy.split(' ');

    const range = rangeStr.split('-').map(Number)

    return {
        password,
        char,
        range
    }
}

const isValid = ({ password, char, range }) => {
    const occurences = countOccurences(password.split(''));
    const count = occurences.get(char) || 0;
    return count >= range[0] && count <= range[1];
}


const run = async () => {
    const records = (await readFileLines(inputPath)).map(parseLine);

    const valid = records
        .map(isValid)
        .filter(isValid => isValid)
        .length;
    console.log(valid);
}

// run();

// ------------------------------- Part 2 -------------------------------

const isValid2 = ({ password, char, range }) => {
    const chars = password.split('');
    const result = range
        .map(ix => chars[ix - 1])
        .filter(c => c === char)
        .length;

    return result === 1;
}


const run2 = async () => {
    const records = (await readFileLines(inputPath)).map(parseLine);

    const valid = records
        .map(isValid2)
        .filter(isValid => isValid)
        .length;
    console.log(valid);
}

run2();
