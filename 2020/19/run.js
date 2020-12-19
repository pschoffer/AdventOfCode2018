const path = require('path');
const { Point, AreaXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const parseRules = (lines) => {
    const rules = {};

    for (const line of lines) {
        const [id, match] = line.split(': ');
        if (match.charAt(0) === '"') {
            rules[id] = match.substr(1, match.length - 2);
        } else {
            const rule = match.split(' ')
                .map(el => el === '|' ? el : `$${el}`)
                .join('');
            rules[id] = rule;
        }
    }

    return rules
}

const parseInput = (lines) => {
    const rules = [];
    const messages = [];

    let ix = 0;
    while (lines[ix]) {
        rules.push(lines[ix]);
        ix++;
    }

    ix++;
    while (ix < lines.length) {
        messages.push(lines[ix])
        ix++;
    }

    return {
        rules: parseRules(rules),
        messages
    }
}


const variableRegex = /\$\d+/;

const getRegex = (rules, id) => {

    let stringRule = rules[id];
    let replacement = stringRule.match(variableRegex);
    while (replacement) {
        const replacementIx = replacement[0].substr(1);
        const newSection = rules[replacementIx].length > 1 ? `(${rules[replacementIx]})` : rules[replacementIx];

        stringRule =
            stringRule.substr(0, replacement['index']) +
            newSection +
            stringRule.substr(replacement['index'] + replacement[0].length);
        replacement = stringRule.match(variableRegex);
    }

    return stringRule;
}

const run = async () => {
    const lines = (await readFileLines(inputPath));

    const input = parseInput(lines);

    const regexString = getRegex(input.rules, 0);

    const regex = new RegExp('^' + regexString + '$');

    const match = input.messages.filter(m => m.match(regex))
    console.log(match.length);
}


run();

// ------------------------------- Part 2 -------------------------------
