const path = require('path');
const { Point, Area3D } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const doCycle = (area) => {
    const pointsToCheck = area.iterate({ useBounds: true, boundsAdjustment: 1 });

    let pointsToRemove = [];
    let pointsToAdd = [];
    for (const [point, value] of pointsToCheck) {

        const neighbours = point.neighbours()
        const activeNeighbours = neighbours.filter(p => area.get(p)).length;

        if (value && (activeNeighbours < 2 || activeNeighbours > 3)) {
            pointsToRemove.push(point);
        } else if (!value && activeNeighbours === 3) {
            pointsToAdd.push(point);
        }
    }

    for (const addPoint of pointsToAdd) {
        area.addPoint(addPoint, '#');
    }

    for (const removePoint of pointsToRemove) {
        area.removePoint(removePoint);
    }
    area.updateAllBounds();
}

const run = async () => {
    const subArea = constructArea(await readFileLines(inputPath))

    const area = new Area3D();
    area.add2DArea(subArea.map, 0);
    area.remove('.');

    for (let ix = 0; ix < 6; ix++) {

        doCycle(area)

    }

    console.log(area.count());
}




run();

// ------------------------------- Part 2 -------------------------------

