const path = require('path');
const { readFileLines } = require('../utils/file');
const { sumArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');



const parseAnswers = (input) => {
    const groups = [];
    let currentGroup = {};
    for (const line of input) {
        if (!line) {
            groups.push(currentGroup);
            currentGroup = {}
            continue;
        }

        const answers = line.split('');
        currentGroup.members = (currentGroup.members || []).concat([new Set(answers)]);
        currentGroup.combined = new Set([...(currentGroup.combined || [])].concat(...answers));
    }
    groups.push(currentGroup);

    return groups;
}


const run = async () => {
    const answersTxt = await readFileLines(inputPath);
    const answers = parseAnswers(answersTxt);

    const counts = answers.map(a => a.combined.size);
    console.log(sumArr(counts));
}

run();

// ------------------------------- Part 2 -------------------------------

