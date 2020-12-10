const path = require('path');
const array = require('../utils/array');
const { updateOccurences } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { mulArr } = require('../utils/math');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');

const countDifferences = (items) => {
    const differences = new Map();

    let totalDiff = 0;
    for (const item of items) {
        updateOccurences(differences, item - totalDiff, 1)
        totalDiff = item;
    }

    return differences;
}

const run = async () => {
    const allAdapters = (await readFileLines(inputPath)).map(Number);

    allAdapters.sort((a, b) => a - b);

    const differences = countDifferences(allAdapters);
    updateOccurences(differences, 3, 1)

    console.log(differences, differences.get(1) * differences.get(3));
}


// run();

// ------------------------------- Part 2 -------------------------------


const getVariableSections = (allAdapters) => {
    let currentState = 0;
    let variableSections = [];
    let currentVariableSection = null;
    for (let ix = 0; ix < allAdapters.length; ix++) {
        const adapter = allAdapters[ix];
        const diff = adapter - currentState;
        const nextDiff = ix === allAdapters.length - 1 ? 3 : allAdapters[ix + 1] - adapter;
        currentState = adapter;

        const isBreaker = diff === 3 || (diff === 2 && nextDiff > 1);
        if (isBreaker) {
            if (currentVariableSection !== null) {
                currentVariableSection.afterDiff = diff;
                variableSections.push(currentVariableSection);
                currentVariableSection = null;
            }
        } else {
            if (currentVariableSection === null) {
                currentVariableSection = {
                    beforeDiff: diff,
                    variables: []
                }
            }
            currentVariableSection.variables.push(adapter);
        }
    }
    return variableSections;
}

const countVariants = (variableSection) => {
    let paths = [
        {
            current: variableSection.variables[0] - variableSection.beforeDiff,
            elements: []
        }
    ];

    const lastIx = variableSection.variables.length - 1;
    for (let ix = 0; ix <= lastIx; ix++) {
        const element = variableSection.variables[ix];
        const afterDiff = ix === lastIx ? variableSection.afterDiff : variableSection.variables[ix + 1] - element;

        const newPaths = [];
        for (const path of paths) {
            const beforeDiff = element - path.current;
            if (beforeDiff + afterDiff < 4) {
                // Add new path
                newPaths.push(JSON.parse(JSON.stringify(path)));
            }

            path.current = element;
            path.elements.push(element);
        }
        paths = paths.concat(newPaths);
    }

    return paths.length;
}

const run2 = async () => {
    const allAdapters = (await readFileLines(inputPath)).map(Number);

    allAdapters.sort((a, b) => a - b);
    const device = Math.max(...allAdapters) + 3;
    allAdapters.push(device)

    const variableSections = getVariableSections(allAdapters)

    const differentPasses = [];
    for (let ix = 0; ix < variableSections.length; ix++) {

        console.log(`${ix + 1}/${variableSections.length} - ${(100 / variableSections.length) * (ix + 1)} %`);
        differentPasses.push(countVariants(variableSections[ix]));

    }
    console.log(mulArr(differentPasses));
}




// run2();

module.exports = {
    countVariants
}

