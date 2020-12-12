const path = require('path');
const { readFileLines } = require('../utils/file');
const { countOccurences } = require('../utils/array');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test2.txt');

const passportFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

const parsePassports = (lines) => {
    const passports = [];

    let currentPassport = {};
    for (const line of lines) {

        if (line) {

            fields = line.split(/\s+/)
                .filter(linePart => linePart)
                .map(linePart => [linePart.substr(0, 3), linePart.substr(4)]);

            for (const field of fields) {
                currentPassport[field[0]] = field[1];
            }
        } else {
            passports.push(currentPassport);
            currentPassport = {};
        }

    }
    passports.push(currentPassport);

    return passports;
}

const isPassportValid = (passport) => {
    const validFields = Object.keys(passport)
        .filter(field => passportFields.includes(field));

    const occurences = countOccurences(validFields);

    const onlyCidMissing = occurences.size === (passportFields.length - 1) && !occurences.has('cid');
    return occurences.size >= passportFields.length || onlyCidMissing;
}

const run = async () => {
    const lines = await readFileLines(inputPath);

    const passports = parsePassports(lines);
    const valid = passports.map(isPassportValid)
        .filter(v => v)

    console.log(valid.length);
}

// run();

// ------------------------------- Part 2 -------------------------------


const passportFields2 = {
    'byr': {
        reg: /^\d\d\d\d$/,
        range: [1920, 2002],
    },
    'iyr': {
        reg: /^\d\d\d\d$/,
        range: [2010, 2020],
    },
    'eyr': {
        reg: /^\d\d\d\d$/,
        range: [2020, 2030],
    },
    'hgt': {
        reg: /^\d+(cm|in)$/,
        cmRange: [150, 193],
        inRange: [59, 76],
    },
    'hcl': /^#[0-9a-f]{6}$/,
    'ecl': /^amb|blu|brn|gry|grn|hzl|oth$/,
    'pid': /^\d{9}$/,
    'cid': /.*/,
}

const isFieldValid = (field, value, condition) => {
    if (Object.keys(condition).length) {
        if (condition.reg) {
            if (!value.match(condition.reg)) {
                // console.error(`Doesnt match reg ${field}: ${value}`);
                return false;
            }
        }
        if (condition.range) {
            const numValue = Number(value);
            if (numValue < condition.range[0] || numValue > condition.range[1]) {
                // console.error(`Doesnt match range ${field}: ${value}`);
                return false
            }
        }
        if (condition.cmRange && value.endsWith('cm')) {
            const numberPart = value.substr(0, value.length - 2);
            const num = Number(numberPart);

            if (num === NaN || num < condition.cmRange[0] || num > condition.cmRange[1]) {
                // console.error(`Doesnt match CMrange ${field}: ${value}`);
                return false
            }
        }

        if (condition.inRange && value.endsWith('in')) {
            const numberPart = value.substr(0, value.length - 2);
            const num = Number(numberPart);

            if (num === NaN || num < condition.inRange[0] || num > condition.inRange[1]) {
                // console.error(`Doesnt match inrange ${field}: ${value}`);
                return false
            }
        }

    } else {
        if (!value.match(condition)) {
            // console.error(`Doesnt match plain reg ${field}: ${value}`);
            return false;
        }
    }
    return true;
}

const isPassportValid2 = (passport) => {

    for (const field of Object.keys(passportFields2)) {
        const value = passport[field] || '';
        const condition = passportFields2[field];
        if (!isFieldValid(field, value, condition)) {
            return false;
        }
    }

    return true;
}


const run2 = async () => {
    const lines = await readFileLines(inputPath);

    const passports = parsePassports(lines);
    const valid = passports.map(isPassportValid2)
        .filter(v => v)

    console.log(valid.length);
}

// run2();

module.exports = {
    isFieldValid,
    passportFields2
}