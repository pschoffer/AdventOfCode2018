const path = require('path');
const { readFileLines } = require('../utils/file');
const { constructArea } = require('../utils/array');
const { Point } = require('../utils/area');
const { mul } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const run = async () => {
    const lines = await readFileLines(inputPath);
    const area = constructArea(lines);

    const adjustment = new Point(3, 1);

    const points = [];

    for (let point = new Point(0, 0); point; point = point.adjust(adjustment, { cornerPointHigh: area.cornerPoint, wrapX: true })) {
        points.push(point);
    }

    const result = area.getPointValues(points)
        .filter(char => char === '#')
        .length



    console.log(result);
}

// run();

// ------------------------------- Part 2 -------------------------------

const countTreesPerSlope = (adjustment, area) => {
    const points = [];
    for (let point = new Point(0, 0); point; point = point.adjust(adjustment, { cornerPointHigh: area.cornerPoint, wrapX: true })) {
        points.push(point);
    }

    const result = area.getPointValues(points)
        .filter(char => char === '#')
        .length

    return result;
}


const run2 = async () => {
    const lines = await readFileLines(inputPath);
    const area = constructArea(lines);

    const adjustments = [
        new Point(1, 1),
        new Point(3, 1),
        new Point(5, 1),
        new Point(7, 1),
        new Point(1, 2)
    ];


    const result = adjustments
        .map(adjustment => countTreesPerSlope(adjustment, area))
        .reduce(mul, 1)



    console.log(result);
}

run2();