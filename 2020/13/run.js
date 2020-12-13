const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { mulArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const parseBusIds = (line) => {

    const parts = line.split(",");
    const ids = [];

    for (const id of parts) {
        if (id === "x") {
            continue;
        }

        ids.push(Number(id));
    }

    return ids;

}


const run = async () => {
    const lines = (await readFileLines(inputPath));

    const estimate = Number(lines[0]);
    const busIds = parseBusIds(lines[1]);

    let minWaitTime = null;
    let minWaitTimeId = null;
    for (const id of busIds) {
        const missedDepartures = Math.floor(estimate / id);
        const nextDeparture = (missedDepartures + 1) * id;
        const waitTime = nextDeparture - estimate;

        if (minWaitTime === null || waitTime < minWaitTime) {
            minWaitTime = waitTime;
            minWaitTimeId = id;
        }
    }
    console.log(minWaitTime, minWaitTimeId, minWaitTime * minWaitTimeId);
}



run();

// ------------------------------- Part 2 -------------------------------
