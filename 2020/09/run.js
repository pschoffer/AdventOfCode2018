const path = require('path');
const array = require('../utils/array');
const { countOccurences, updateOccurences } = require('../utils/array');
const { readFileLines } = require('../utils/file');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

let preamble = 25;
// preamble = 5;

const run = async () => {
    const allNumbers = (await readFileLines(inputPath)).map(Number);

    const preambleNumbers = [...allNumbers].splice(0, preamble);

    const currentOccurences = countOccurences(preambleNumbers);

    for (let ix = preamble; ix < allNumbers.length; ix++) {
        const intervalStartIx = ix - preamble;
        if (intervalStartIx) {
            updateOccurences(currentOccurences, allNumbers[intervalStartIx - 1], -1)
            updateOccurences(currentOccurences, allNumbers[ix - 1], 1)
        }

        const element = allNumbers[ix];
        let match = null;
        for (let intervalIx = intervalStartIx; intervalIx < intervalStartIx + preamble; intervalIx++) {
            const candidate1 = allNumbers[intervalIx];
            const candidate2 = element - candidate1;
            if (candidate1 !== candidate2 && currentOccurences.get(candidate2)) {
                // console.log(`Found it ${candidate1} + ${candidate2} = ${element}`);
                match = [candidate1, candidate2];
                break;
            }
        }
        if (!match) {
            return {
                allNumbers,
                element
            }
        }
    }
}

// run();

// ------------------------------- Part 2 -------------------------------


const run2 = async () => {
    const { allNumbers, element: target } = await run();

    let currentSum = 0;
    let currentOccurences = new Map();
    let currentLowestIx = 0;
    for (let ix = 0; ix < allNumbers.length; ix++) {
        currentSum += allNumbers[ix];
        updateOccurences(currentOccurences, allNumbers[ix], 1);

        while (currentSum > target) {
            const lowest = allNumbers[currentLowestIx];
            currentSum -= lowest;
            updateOccurences(currentOccurences, lowest, -1);
            currentLowestIx++;
        }

        if (currentSum === target) {
            console.log("FOUND IT", currentSum, currentOccurences, currentLowestIx);
            break;
        }
    }

    const additionNumbers = [...currentOccurences.keys()].sort();
    const result = additionNumbers[0] + additionNumbers[additionNumbers.length - 1];
    console.log(result);
}

run2();