const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const parseInput = (lines) => {
    const data = {
        'fields': {},
        'rest': []
    };

    let processing = 'fields';
    for (const line of lines) {
        if (!line) {
            processing = 'unknown';
            continue;
        }
        if (line === 'your ticket:') {
            processing = 'your';
            continue;
        }
        if (line === 'nearby tickets:') {
            processing = 'rest';
            continue;
        }


        switch (processing) {
            case 'fields':
                const [field, intervalString] = line.split(': ');
                const intervals = intervalString
                    .split(' or ')
                    .map(input => {
                        const [start, end] = input.split('-').map(Number);
                        return new Interval(start, end)
                    });

                data[processing][field] = intervals;
                break;
            case 'your':
                data[processing] = line.split(',').map(Number);
                break
            case 'rest':
                data[processing].push(line.split(',').map(Number));
                break

            default:
                break;
        }
    }


    return data;
}

const unifyConditions = (conditions) => {
    const allConditions = Object.keys(conditions)
        .map(field => conditions[field])
        .reduce((prev, curr) => prev.concat(curr), [])

    allConditions.sort((a, b) => a.bounds[0] - b.bounds[0])

    const combinedConditions = [];
    let currentSum = allConditions[0];
    for (let ix = 1; ix < allConditions.length; ix++) {
        const current = allConditions[ix];

        if (current.bounds[0] <= currentSum.bounds[1] + 1) {
            currentSum = new Interval(currentSum.bounds[0], current.bounds[1]);
        } else {
            combinedConditions.push(currentSum);
            currentSum = current;
        }

    }
    combinedConditions.push(currentSum);
    return combinedConditions
}

const run = async () => {
    const lines = (await readFileLines(inputPath))
    const data = parseInput(lines);

    const combinedConditions = unifyConditions(data.fields)

    let invalidSum = 0;
    for (const ticket of data.rest) {
        for (const value of ticket) {
            const match = combinedConditions
                .filter(cond => cond.contains(value));
            if (!match.length) {
                invalidSum += value;
            }
        }
    }

    console.log(invalidSum);
}



run();

// ------------------------------- Part 2 -------------------------------
