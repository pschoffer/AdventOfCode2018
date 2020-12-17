const path = require('path');
const { Point, Area3D } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
inputPath = path.join(__dirname, 'test.txt');


const run = async () => {
    const subArea = constructArea(await readFileLines(inputPath))




    const area = new Area3D();
    area.add2DArea(subArea.map, 0);
    area.remove('.');


    console.log(area);


}



run();

// ------------------------------- Part 2 -------------------------------

