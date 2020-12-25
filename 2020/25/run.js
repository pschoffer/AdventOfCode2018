const path = require('path');
const { Point, AreaXD, PointXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval, range } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress, perfTime } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const CRYPTO_DEVIDER = 20201227;

const crypto = (subject, loops) => {

    let result = 1;
    for (let counter = 1; counter <= loops; counter++) {
        result = result * subject;
        result = result % CRYPTO_DEVIDER;
    }
    return result;

}

const findLoopSize = (subject, result) => {
    let loopSize = 1;
    let cryptoResult = crypto(subject, loopSize);
    while (cryptoResult !== result) {
        console.log(loopSize, ": ", cryptoResult);
        loopSize++;
        cryptoResult = crypto(subject, loopSize);
    }
    return loopSize;
}


const findLoopSizeSmart = (subject, candidates) => {
    const highestPossibleStepValue = CRYPTO_DEVIDER * subject;
    let loopSize = 0;

    while (!candidates.includes(1)) {

        const newCandidates = [];
        for (const candidate of candidates) {

            let dividerCount = 0;

            let subResult = dividerCount * CRYPTO_DEVIDER + candidate;
            while (subResult < highestPossibleStepValue) {
                if (!(subResult % subject)) {
                    newCandidates.push(subResult / subject);
                }
                dividerCount++;
                subResult = dividerCount * CRYPTO_DEVIDER + candidate;
            }
        }

        candidates = newCandidates;
        loopSize++;
    }
    return loopSize;
}


const run = async () => {
    const pubKeys = (await readFileLines(inputPath)).map(Number);

    const loopSizes = pubKeys.map(pubKey => findLoopSizeSmart(7, [pubKey]));

    console.log(crypto(pubKeys[0], loopSizes[1]));
}

run()

// ------------------------------- Part 2 -------------------------------
