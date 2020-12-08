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


    console.log(runner);
}

// run();

// ------------------------------- Part 2 -------------------------------

const run2 = async () => {
    const program = (await readFileLines(inputPath)).map(parseInstruction);
    const runners = [...Array(program.length).keys()]
        .filter(ix => program[ix].instructionCode === 'nop' || program[ix].instructionCode === 'jmp')
        .map(ix => {
            const newProgram = JSON.parse(JSON.stringify(program));
            newProgram[ix].instructionCode = program[ix].instructionCode === 'nop' ? 'jmp' : 'nop';
            return newProgram;
        })
        .map(program => new Runner(program));


    let count = 1;
    for (const runner of runners) {
        const result = runner.execute();


        console.log(`${count++}/${runners.length} - ${result.ok}`);
        if (result.ok) {
            console.log(result);
            break;
        }
    }
}

run2();