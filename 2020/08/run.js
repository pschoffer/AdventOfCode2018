const path = require('path');
const { readFileLines } = require('../utils/file');
const { sumArr } = require('../utils/math');
const { Runner } = require('../utils/runner');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const target = 'shiny gold';

const parseInstruction = (line) => {
    const parts = line.split(" ");
    const instructionCode = parts.shift();
    const args = parts.map(Number);
    return {
        instructionCode,
        args
    }
}


const run = async () => {
    const program = (await readFileLines(inputPath)).map(parseInstruction);

    const runner = new Runner(program);

    runner.execute();

    console.log(runner);
}

run();

// ------------------------------- Part 2 -------------------------------

