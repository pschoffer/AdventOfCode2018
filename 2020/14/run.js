const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { sumArr } = require('../utils/math');
const { Runner } = require('../utils/runner');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const parseInst = (line) => {
    const parts = line.split(" = ");
    if (parts[0] === 'mask') {
        return {
            instructionCode: parts[0],
            args: [parts[1].trim()]
        }
    } else {
        let address = parts[0].substr(4);
        address = Number(address.substr(0, address.length - 1))
        const value = Number(parts[1].trim())

        return {
            instructionCode: 'mem',
            args: [address, value]
        }
    }
}

const run = async () => {
    const instr = (await readFileLines(inputPath)).map(parseInst
    );

    const runner = new Runner(instr);
    const resultRun = runner.execute();

    const result = sumArr(Object.keys(runner.memory).map(key => runner.memory[key]));
    console.log(result);
}



run();

// ------------------------------- Part 2 -------------------------------

