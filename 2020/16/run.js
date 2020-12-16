const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');

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



// run();

// ------------------------------- Part 2 -------------------------------

const isTicketValid = (ticket, combinedConditions) => {
    for (const value of ticket) {
        const match = combinedConditions
            .filter(cond => cond.contains(value));
        if (!match.length) {
            return false;
        }
    }
    return true;
}

const doValuesMatchAnyConditions = (values, conditions) => {
    for (const value of values) {
        const match = conditions.filter(cond => cond.contains(value));
        if (!match.length) {
            return false;
        }
    }
    return true;
}

const run2 = async () => {
    const lines = (await readFileLines(inputPath))
    const data = parseInput(lines);

    const combinedConditions = unifyConditions(data.fields)

    const validTickets = data.rest.filter(ticket => isTicketValid(ticket, combinedConditions));

    const allFields = Object.keys(data.fields);
    const fieldCandidates = allFields.map(field => new Set(allFields));
    const hitFields = allFields.map(field => null);
    let ixToHit = [...Array(hitFields.length).keys()];
    const valuesPerField = ixToHit.map(ix => validTickets.map(ticket => ticket[ix]));


    for (const ix of ixToHit) {
        const candidates = fieldCandidates[ix];
        const values = valuesPerField[ix];

        for (const candidate of candidates) {
            const conditions = data.fields[candidate];
            const match = doValuesMatchAnyConditions(values, conditions)
            if (!match) {
                fieldCandidates[ix].delete(candidate)
            }
        }
    }

    while (ixToHit.length) {
        // console.log("Cleanign up", ixToHit.length, hitFields.length);

        let toClear = [];
        for (const ix of ixToHit) {
            if (fieldCandidates[ix].size === 1) {
                const hit = fieldCandidates[ix].values().next().value;
                toClear.push(ix)
                hitFields[ix] = hit;
                ixToHit.forEach(otherIx => fieldCandidates[otherIx].delete(hit))
            }
        }
        ixToHit = ixToHit.filter(ix => !toClear.includes(ix));
    }


    const valuesToMul = []
    for (let ix = 0; ix < hitFields.length; ix++) {
        if (hitFields[ix].startsWith("departure")) {
            console.log(`${hitFields[ix]}: ${data.your[ix]}`);
            valuesToMul.push(data.your[ix]);
        }

    }
    console.log(mulArr(valuesToMul))

}



run2();
