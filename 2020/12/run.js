const path = require('path');
const { Point } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { mulArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const DIRECTIONS = ['E', 'S', 'W', 'N'];
const ADJUSTMENTS = {
    E: new Point(1, 0),
    N: new Point(0, -1),
    W: new Point(-1, 0),
    S: new Point(0, 1),
}


const parseInstr = (line) => {
    return {
        code: line.charAt(0),
        number: Number(line.substr(1))
    }

}

class Ship {
    constructor() {
        this.position = new Point(0, 0);
        this.directionIx = 0;
    }

    processInstruction(instr) {
        switch (instr.code) {
            case 'F':
                const adjustmentForward = ADJUSTMENTS[DIRECTIONS[this.directionIx]].multiply(instr.number);
                this.position = this.position.adjust(adjustmentForward);
                break;
            case 'E':
            case 'N':
            case 'W':
            case 'S':
                const adjustmentDirection = ADJUSTMENTS[instr.code].multiply(instr.number);
                this.position = this.position.adjust(adjustmentDirection);
                break;
            case 'R':
            case 'L':
                const dirShift = instr.number / 90;
                const dirShiftLR = instr.code === 'L' && dirShift !== 0 ? -dirShift : dirShift;
                const shiftedIx = (this.directionIx + dirShiftLR) % DIRECTIONS.length;
                this.directionIx = shiftedIx < 0 ? (DIRECTIONS.length + shiftedIx) : shiftedIx;
                if (this.directionIx === -0) {
                    this.directionIx = 0;
                }
                break;
            default:
                console.error(`ERROR: Unkown instr ${instr.code}`);
                break;
        }
    }

    print() {
        console.log(`_|_ ${this.position} pos: ${DIRECTIONS[this.directionIx]}`);
    }
}

const run = async () => {
    const instructions = (await readFileLines(inputPath)).map(parseInstr);

    const ship = new Ship();
    ship.print();
    for (const inst of instructions) {
        console.log(`INST ${inst.code} ${inst.number}`);
        ship.processInstruction(inst);
        ship.print();
    }

    console.log(ship.position.manhaton());
}



// run();

// ------------------------------- Part 2 -------------------------------


module.exports = {
    Ship,
    parseInstr
}