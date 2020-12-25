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

const ADJUSTMENTS = {
    //  [ x , y ]
    nw: [-1, 1],
    ne: [1, 1],
    w: [-2, 0],
    e: [2, 0],
    sw: [-1, -1],
    se: [1, -1],
}

const parseFlip = (input) => {
    const letters = input.split('');
    const instructions = [];
    const validInstrs = Object.keys(ADJUSTMENTS);

    let collector = '';
    for (const letter of letters) {
        collector += letter;
        if (validInstrs.includes(collector)) {
            instructions.push(collector);
            collector = "";
        }
    }
    return instructions;
}

const findPoint = (instructions) => {
    let currentCoordinates = [0, 0];

    for (const instr of instructions) {
        const adj = ADJUSTMENTS[instr];

        const newCoordinate = [0, 1].map(ix => currentCoordinates[ix] + adj[ix]);

        currentCoordinates = newCoordinate;
    }

    return new PointXD(...currentCoordinates);
}

const run = async () => {
    let flips = (await readFileLines(inputPath)).map(parseFlip);

    const area = new AreaXD(2);

    for (const flip of flips) {
        const point = findPoint(flip)

        if (area.get(point)) {
            area.removePoint(point)
        } else {
            area.addPoint(point, true)
        }
    }

    console.log(area.count());
}

run()

// ------------------------------- Part 2 -------------------------------

