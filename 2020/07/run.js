const path = require('path');
const { readFileLines } = require('../utils/file');
const { sumArr } = require('../utils/math');
const { PathFinder } = require('../utils/path');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const target = 'shiny gold';

const parseRules = (input) => {
    const rules = {}

    for (const line of input) {
        const parts = line.split(" contain ");
        const source = parts[0].split(" bags")[0]

        rules[source] = {};

        if (!parts[1].includes("no other bags")) {
            const targetStrings = parts[1]
                .substr(0, parts[1].length - 1)
                .split(', ');


            for (const targetString of targetStrings) {
                const match = targetString.match(/(\d+) (.*) bag/);
                rules[source][match[2]] = Number(match[1]);
            }
        }
    }

    return rules;
}


const run = async () => {
    const inputTxt = await readFileLines(inputPath);
    const rules = parseRules(inputTxt);

    const pathFiner = new PathFinder();

    const matches = [];
    for (const bagIdentifier of Object.keys(rules)) {

        const length = pathFiner.dijkstraAlgorithm(bagIdentifier, target, (idToExplode, distance) => {
            return Object.keys(rules[idToExplode]).map((newId) => [newId, distance + 1]);
        })

        if (length) {
            matches.push([bagIdentifier, length]);
        }
    }

    console.log(matches.length);
}

run();

// ------------------------------- Part 2 -------------------------------

