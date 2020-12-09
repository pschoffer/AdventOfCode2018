const path = require('path');
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
            console.log(`${element} - NOT found`);
        }
    }
}

run();

// ------------------------------- Part 2 -------------------------------

