const path = require('path');
const { Point, AreaXD, PointXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval, range } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');




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

