const path = require('path');
const { readFileLines } = require('../utils/file');
const { countOccurences } = require('../utils/array');
const { Interval } = require('../utils/interval');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');

const rowCount = 128;
const seatCount = 8;


const parseSpecification = (input) => {
    const rowSpecifier = input.substring(0, 7).split('');
    const seatSpecifier = input.substring(7).split('')

    return {
        input,
        rowSpecifier,
        seatSpecifier
    }
}

const convertToSeat = (specification) => {

    const binaryInstructions = specification.rowSpecifier.map(r => r === 'F' ? 'LOW' : 'HGH');
    const binaryInstructionsSeat = specification.seatSpecifier.map(r => r === 'L' ? 'LOW' : 'HGH');

    let rowInterval = new Interval(rowCount).binaryDivide(binaryInstructions);
    let seatInterval = new Interval(seatCount).binaryDivide(binaryInstructionsSeat);

    const row = rowInterval.bounds[0];
    const seat = seatInterval.bounds[0];
    const id = row * 8 + seat;

    return {
        row,
        seat,
        id
    }
}


const run = async () => {
    const specifications = (await readFileLines(inputPath)).map(parseSpecification);
    const seats = specifications.map(convertToSeat);

    const highest = Math.max(...seats.map(seat => seat.id));

    console.log(highest);
}

run();

// ------------------------------- Part 2 -------------------------------
