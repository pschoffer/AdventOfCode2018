const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { mulArr, sumArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');


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



// run();

// ------------------------------- Part 2 -------------------------------

const parseBusIds2 = (line) => {

    const parts = line.split(",");
    const ids = [];

    for (let ix = 0; ix < parts.length; ix++) {
        const element = parts[ix];
        if (element === "x") {
            continue;
        }

        const id = Number(element);
        ids.push({
            id,
            ix
        });
    }

    return ids;

}


const lowestMultiplyer = (input) => {
    const inputCopy = [...input];

    inputCopy.sort((a, b) => b - a);
    let current = inputCopy[0];
    for (let ix = 1; ix < inputCopy.length; ix++) {
        if (current % inputCopy[ix]) {
            current = current * inputCopy[ix];
        }
    }

    return current;

}

const doesDepartureAlign = (currentT, bus) => ((currentT + bus.ix) % bus.id) === 0

const run2 = async () => {
    const lines = (await readFileLines(inputPath));
    const busIds = parseBusIds2(lines[1]);

    const matchMap = {}


    let step = busIds[0].id
    let currentT = step;
    matchMap[step] = { matched: true, step }
    let remaining = busIds.filter(id => !(matchMap[id.id] && matchMap[id.id].matched));
    while (remaining.length) {


        const matches = remaining.filter(id => doesDepartureAlign(currentT, id)).map(id => id.id);

        if (matches.length) {
            if (remaining.length === matches.length) {
                console.log("\\o/ Got it!!");
                break;
            }

            const newMatch = matches.filter(id => matchMap[id] && matchMap[id].firstMatch);

            if (newMatch.length) {
                const id = newMatch[0]
                matchMap[id].step = currentT - matchMap[id].firstMatch;
                matchMap[id].matched = true;

                for (const id of Object.keys(matchMap)) {
                    if (!matchMap[id].matched) {
                        matchMap[id].firstMatch = null;
                    }
                }
                remaining = busIds.filter(id => !(matchMap[id.id] && matchMap[id.id].matched));
                step = currentT - matchMap[id].firstMatch;
            } else {
                for (const id of matches) {
                    matchMap[id] = {
                        firstMatch: currentT
                    }
                }
            }


            console.log(currentT, step, matchMap, remaining, matches);
        }

        remaining = busIds.filter(id => !(matchMap[id.id] && matchMap[id.id].matched));
        currentT = currentT + step;
    }

    console.log(currentT);
}



// run2();

module.exports = {
    lowestMultiplyer
}