const path = require('path');
const { Point, AreaXD, PointXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval, range } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');


const parseInput = (lines) => {
    const allIngredients = new Set();
    const allAlergens = new Set();
    const resultLines = []

    for (const line of lines) {
        const lineResult = {
            ingredients: new Set(),
            alergens: new Set(),
        }
        let ingredientsPart = line;
        if (line.match(/\(contains/)) {
            const parts = line.split(" (contains ")
            ingredientsPart = parts[0];
            lineResult.alergens = new Set(parts[1].substr(0, parts[1].length - 1).split(', '));
        }
        lineResult.ingredients = new Set(ingredientsPart.split(' '));

        lineResult.ingredients.forEach(ingredient => allIngredients.add(ingredient))
        lineResult.alergens.forEach(alergen => allAlergens.add(alergen))

        resultLines.push(lineResult);
    }

    return {
        allAlergens,
        allIngredients,
        resultLines
    }

}

const findIngredientsMatching = (input) => {

    const found = {
        alergenToIngredient: {},
        ingredientToAlergen: {}
    };
    const toFind = {};

    input.allAlergens.forEach(a => toFind[a] = new Set(input.allIngredients));

    while (Object.keys(toFind).length) {
        for (const line of input.resultLines) {
            for (const alergen of line.alergens) {
                if (toFind[alergen]) {
                    const oldCandidates = toFind[alergen];
                    const newCandidates = [...line.ingredients]
                        .filter(candidate => oldCandidates.has(candidate))
                        .filter(candidate => !found.ingredientToAlergen[candidate]);
                    if (newCandidates.length === 1) {
                        const ingredient = newCandidates.values().next().value;
                        found.ingredientToAlergen[ingredient] = alergen;
                        found.alergenToIngredient[alergen] = ingredient;
                        delete toFind[alergen];
                    } else {
                        toFind[alergen] = new Set(newCandidates);
                    }
                }
            }
        }
    }
    return found;
}

const run = async () => {
    const lines = (await readFileLines(inputPath));

    const input = parseInput(lines);

    const found = findIngredientsMatching(input);
    const notFound = [...input.allIngredients]
        .filter(ingredient => !found.ingredientToAlergen[ingredient]);

    let count = 0;

    for (const line of input.resultLines) {
        count += [...line.ingredients]
            .filter(ingredient => notFound.includes(ingredient))
            .length
    }


    console.log(notFound, count);
}

// run()

// ------------------------------- Part 2 -------------------------------

const run2 = async () => {
    const lines = (await readFileLines(inputPath));

    const input = parseInput(lines);

    const found = findIngredientsMatching(input);

    const alergens = Object.keys(found.alergenToIngredient);
    alergens.sort();
    const sortedIngredients = alergens
        .map(alergen => found.alergenToIngredient[alergen])
        .join(',')

    console.log(sortedIngredients);
}

run2()