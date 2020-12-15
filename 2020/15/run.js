const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { sumArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');

const TargetRound = 2020;

const run = async () => {
    const startNumbers = (await readFileLines(inputPath))[0].split(",").map(Number);

    const numberPositions = new Map();
    const numbersInOrder = []
    for (let ix = 0; ix < startNumbers.length; ix++) {
        numberPositions.set(startNumbers[ix], [ix]);
        numbersInOrder.push(startNumbers[ix])
    }

    let currentNumber;
    for (let round = startNumbers.length; round < TargetRound; round++) {
        const prevNumber = numbersInOrder[round - 1];
        const prevOccurences = numberPositions.get(prevNumber);

        if (prevOccurences.length < 2) {
            currentNumber = 0;
        } else {
            currentNumber = round - prevOccurences[prevOccurences.length - 2] - 1;
        }

        const currentOccurences = (numberPositions.get(currentNumber) || []).concat([round]);
        numberPositions.set(currentNumber, currentOccurences);
        numbersInOrder.push(currentNumber)
    }

    console.log(currentNumber);
}



// run();

// ------------------------------- Part 2 -------------------------------

const TargetRound2 = 30000000;
const run2 = async () => {
    const startNumbers = (await readFileLines(inputPath))[0].split(",").map(Number);

    const numberPositions = new Map();
    for (let ix = 0; ix < startNumbers.length - 1; ix++) {
        numberPositions.set(startNumbers[ix], ix);
    }
    let prevNumber = startNumbers[startNumbers.length - 1];
    let currentNumber;
    for (let round = startNumbers.length; round < TargetRound2; round++) {
        if (round % 1000 === 0) {
            progress(round, TargetRound2);
        }
        // console.log(currentNumber);
        // console.log(numberPositions);

        if (numberPositions.has(prevNumber)) {
            currentNumber = round - numberPositions.get(prevNumber) - 1;
        } else {
            currentNumber = 0;
        }

        numberPositions.set(prevNumber, round - 1);
        prevNumber = currentNumber;
    }

    console.log(currentNumber);
}



run2();
