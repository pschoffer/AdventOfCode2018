const path = require('path');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { mulArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const SEAT_EMPTY = 'L';
const SEAT_OCCUPIED = '#';
const FLOOR = '.';

const run = async () => {
    const lines = (await readFileLines(inputPath));

    const area = constructArea(lines);

    let pointsChanged = step(area);
    let stepIx = 1;
    while (pointsChanged.length) {
        console.log(`Step ${stepIx++}: ${pointsChanged.length}`);
        pointsChanged = step(area);
    }

    area.print();

    console.log(area.countValue(SEAT_OCCUPIED));
}


const step = (area) => {

    const pointsToSet = [];
    for (const point of area.pointIterator()) {
        const currentValue = area.getPointValue(point);
        if (currentValue === FLOOR) {
            continue;
        }
        const neighbours = area.getNeighbours(point, { includeDiagonal: true });
        const neighbourValues = area.getPointValues(neighbours);
        const occupiedCount = neighbourValues.filter(v => v === SEAT_OCCUPIED).length;

        // if (point.y === 3 && point.x === 6) {
        //     console.log("Checking", point)
        //     console.log(neighbours, neighbourValues, occupiedCount);
        // }

        if (currentValue === SEAT_EMPTY && occupiedCount === 0) {
            pointsToSet.push([point, SEAT_OCCUPIED]);
        } else if (currentValue === SEAT_OCCUPIED && occupiedCount > 3) {
            pointsToSet.push([point, SEAT_EMPTY]);
        }
    }


    for (const [point, newValue] of pointsToSet) {
        area.setPointValue(point, newValue);
    }

    return pointsToSet.map(([point]) => point);
}


// run();

// ------------------------------- Part 2 -------------------------------

const run2 = async () => {
    const lines = (await readFileLines(inputPath));

    const area = constructArea(lines);

    let pointsChanged = step2(area);
    let stepIx = 1;
    while (pointsChanged.length) {
        console.log(`Step ${stepIx++}: ${pointsChanged.length}`);
        pointsChanged = step2(area);
    }

    area.print();

    console.log(area.countValue(SEAT_OCCUPIED));
}


const step2 = (area) => {

    const pointsToSet = [];
    for (const point of area.pointIterator()) {
        const currentValue = area.getPointValue(point);
        if (currentValue === FLOOR) {
            continue;
        }
        const neighbours = area.getNeighbours(point, { includeDiagonal: true, extendDirection: true, extendDirectionStop: [SEAT_OCCUPIED, SEAT_EMPTY] });

        const neighbourValues = area.getPointValues(neighbours);
        const occupiedCount = neighbourValues.filter(v => v === SEAT_OCCUPIED).length;

        // if (point.y === 7 && point.x === 9) {
        //     console.log("Checking", point)
        //     console.log(neighbours, neighbourValues, occupiedCount);
        // }

        if (currentValue === SEAT_EMPTY && occupiedCount === 0) {
            pointsToSet.push([point, SEAT_OCCUPIED]);
        } else if (currentValue === SEAT_OCCUPIED && occupiedCount > 4) {
            pointsToSet.push([point, SEAT_EMPTY]);
        }
    }


    for (const [point, newValue] of pointsToSet) {
        area.setPointValue(point, newValue);
    }

    return pointsToSet.map(([point]) => point);
}


run2();
