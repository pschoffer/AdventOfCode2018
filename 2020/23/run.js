const path = require('path');
const { Point, AreaXD, PointXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval, range } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
inputPath = path.join(__dirname, 'test.txt');




const splice = (arr, start, length) => {
    start = start % arr.length;
    end = (start + length) % arr.length;

    if (start > end) {
        const endPart = arr.splice(start);
        const startPart = arr.splice(0, end);

        return endPart.concat(startPart)
    } else {
        return arr.splice(start, end - start);
    }

}

const digest = (arr) => {
    const fullStr = arr.join('');

    const splitterIx = fullStr.indexOf('1');

    return fullStr.substr(splitterIx + 1) + fullStr.substr(0, splitterIx)

}

const run = async () => {
    let shells = (await readFileLines(inputPath))[0].split('').map(Number);

    const targetRounds = 100;
    let currentRound = 0;
    let currentItem = shells[0];

    while (currentRound < targetRounds) {
        let currentIx = shells.indexOf(currentItem);

        const movedShells = splice(shells, currentIx + 1, 3);

        let destinationItem = currentItem - 1;
        while (shells.indexOf(destinationItem) === -1) {
            destinationItem--;
            if (destinationItem < 0) {
                destinationItem = 9;
            }
        }
        const destinationIx = shells.indexOf(destinationItem);

        const start = shells.splice(0, destinationIx + 1);
        shells = start.concat(movedShells).concat(shells);

        currentIx = shells.indexOf(currentItem);
        currentItem = currentIx + 1 < shells.length ? shells[currentIx + 1] : shells[0]

        currentRound++;
    }

    console.log(digest(shells));

}

run()

// ------------------------------- Part 2 -------------------------------

const fillRest = (shells, size) => {
    const newShells = range(1, size);

    for (let ix = 0; ix < shells.length; ix++) {
        newShells[ix] = shells[ix];
    }

    return newShells;
}

const normelizeIx = (ix, size) => {
    return normelizeValue(ix, size, -1);
}

const normelizeValue = (value, size, shift = 0) => {
    if (value < (1 + shift)) {
        return size + value;
    } else if (value > (size + shift)) {
        return value - size;
    }
    return value;
}

const searchItemBack = (item, startIx, shells) => {
    let candidateIx = normelizeIx(startIx - 1, shells.length);
    while (shells[candidateIx] !== item) {
        candidateIx = normelizeIx(candidateIx - 1, shells.length);
    }
    return candidateIx;
}

const shuffleShells = (fromIx, blacklistValues, destinationIx, shells) => {
    const size = shells.length;
    const clockWiseDist = fromIx < destinationIx ? destinationIx - fromIx : (size - 1 - fromIx) + destinationIx;
    const fromValue = shells[fromIx];
    let newFromIx = fromIx;
    if (clockWiseDist > (shells.length / 2)) {
        // doing counterClocwise replacement
        // 1 (E) 3 4 (S) X X X 6
        // 1 (E) X X X 3 4 (S) 6
        const startPuttingBlacklistIx = normelizeIx(destinationIx + 3, size);
        let currentIx = normelizeIx(fromIx + 3, size);
        while (currentIx !== startPuttingBlacklistIx) {
            shells[currentIx] = shells[normelizeIx(currentIx - 3, size)];
            if (shells[currentIx] === fromValue) {
                newFromIx = currentIx;
            }

            currentIx = normelizeIx(currentIx - 1, size);
        }
        for (let ix = blacklistValues.length - 1; ix >= 0; ix--) {
            shells[currentIx] = blacklistValues[ix];
            if (shells[currentIx] === fromValue) {
                newFromIx = currentIx;
            }

            currentIx = normelizeIx(currentIx - 1, size);
        }

    } else {
        // doing Clockwise replacement
        // 1 (S) X X X 3 4 (E) 6
        // 1 (S) 3 4 (E) X X X 6

        const startPuttingBlacklistIx = normelizeIx(destinationIx - 2, size);
        let currentIx = normelizeIx(fromIx + 1, size);
        while (currentIx !== startPuttingBlacklistIx) {
            shells[currentIx] = shells[normelizeIx(currentIx + 3, size)];
            if (shells[currentIx] === fromValue) {
                newFromIx = currentIx;
            }

            currentIx = normelizeIx(currentIx + 1, size);
        }
        for (const blackListValue of blacklistValues) {
            shells[currentIx] = blackListValue;
            if (shells[currentIx] === fromValue) {
                newFromIx = currentIx;
            }

            currentIx = normelizeIx(currentIx + 1, size);
        }
    }
    return newFromIx;
}

const findDestinationIX = (currentIx, shells, balcklistItems) => {
    const size = shells.length;

    let destinationItem = normelizeValue(shells[currentIx] - 1, size);
    while (balcklistItems.includes(destinationItem)) {
        destinationItem = normelizeValue(destinationItem - 1, size);
    }
    return searchItemBack(destinationItem, currentIx, shells);
}

const processShells = (shells, targetRounds) => {
    let currentIx = 0;
    const size = shells.length;
    for (let round = 0; round < targetRounds; round++) {
        const blacklistIxs = [1, 2, 3].map(shift => normelizeIx(currentIx + shift, size));
        const balcklistItems = blacklistIxs.map(ix => shells[ix]);

        const destinationIx = findDestinationIX(currentIx, shells, balcklistItems);

        const newCurrentIx = shuffleShells(currentIx, balcklistItems, destinationIx, shells);

        currentIx = normelizeIx(newCurrentIx + 1, size);
    }

    return {
        shells
    }
}

const run2 = async (size, targetRounds) => {
    let shells = (await readFileLines(inputPath))[0].split('').map(Number);

    shells = fillRest(shells, size);

    const result = processShells(shells, targetRounds)

    shells = result.shells;

    console.log(digest(shells));

    const indexOne = shells.indexOf(1);
    console.log(`Index ${indexOne}, ${shells[indexOne + 1]} * ${shells[indexOne + 2]} = ${shells[indexOne + 1] * shells[indexOne + 2]}`);
}

run2(9, 100);