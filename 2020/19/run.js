const path = require('path');
const { Point, AreaXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');
var XRegExp = require('xregexp');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');


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


// run();

// ------------------------------- Part 2 -------------------------------

// const INPUT_REPLACEMENT = ["8: 42 | 42 8", "11: 42 31 | 42 11 31"]

const run2 = async () => {
    const lines = (await readFileLines(inputPath));

    const input = parseInput(lines);

    /**
     * 0: 8 11
     * $42+$42{x}$31{x}
     */

    input.rules[8] = '$42+'
    input.rules[11] = '$42+$31+';


    const regexString = getRegex(input.rules, 0);

    const regex = new XRegExp('^' + regexString + '$');
    const firstMatch = input.messages.filter(m => XRegExp.exec(m, regex));

    const regexString42 = getRegex(input.rules, 42);
    const regexString31 = getRegex(input.rules, 31);

    let validCount = 0;
    for (let input of firstMatch) {
        let match42 = 0
        let match31 = 0
        const regex42Start = new XRegExp('^(?<42_match>' + regexString42 + ')');

        for (let match = XRegExp.exec(input, regex42Start); match; match = XRegExp.exec(input, regex42Start)) {
            match42++;
            input = input.substr(match[0].length);
        }

        const regex31end = new XRegExp('^(?<31_match>' + regexString31 + ')');

        for (let match = XRegExp.exec(input, regex31end); match; match = XRegExp.exec(input, regex31end)) {
            match31++;
            input = input.substr(match[0].length);
        }
        const valid = match31 + 1 <= match42;
        if (valid) {
            validCount++;
        }
    }

    // const tough = match.filter(m => m.matchMe || m.matchMe2)
    console.log(firstMatch.length, validCount);
}

run2();
