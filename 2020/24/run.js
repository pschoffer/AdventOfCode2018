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
    return area;
}

// run()

// ------------------------------- Part 2 -------------------------------

const getNeighbours = (point) => {
    return Object.keys(ADJUSTMENTS)
        .map(key => {
            const adj = ADJUSTMENTS[key];
            const newCoordinates = [0, 1].map(ix => point.coordinate[ix] + adj[ix]);
            return new PointXD(...newCoordinates);
        })
}

const markNeighbours = (point, neighbourCounterArea) => {
    const neighbours = getNeighbours(point)

    for (const neighbour of neighbours) {
        const prevCount = neighbourCounterArea.get(neighbour) || 0;
        neighbourCounterArea.addPoint(neighbour, prevCount + 1);
    }
}

const run2 = async () => {
    const area = await run();

    const rounds = 100;

    for (let round = 1; round <= rounds; round++) {

        const neighbourCounterArea = new AreaXD(2);
        const blackTiles = area.iterate().map(([point]) => point);
        for (const blackTile of blackTiles) {
            markNeighbours(blackTile, neighbourCounterArea);
        }
        /// addMissingBlackTiles
        for (const blackTile of blackTiles) {
            if (!neighbourCounterArea.get(blackTile)) {
                neighbourCounterArea.addPoint(blackTile, 0);
            }
        }

        for (const [point, count] of neighbourCounterArea.iterate()) {
            if (area.get(point)) {
                // currently black
                if (count === 0 || count > 2) {
                    area.removePoint(point)
                }
            } else {
                // curently white
                if (count === 2) {
                    area.addPoint(point, true)
                }

            }
        }

        console.log(round, area.count());
    }


}

run2()