const path = require('path');
const { readFileLines } = require('../utils/file');
const { constructArea } = require('../utils/array');
const { Point } = require('../utils/area');

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

run();

// ------------------------------- Part 2 -------------------------------


