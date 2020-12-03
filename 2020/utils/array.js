const { Area } = require("./area");

const countOccurences = (input) => {
    const occurences = new Map();

    for (const item of input) {
        occurences.set(item, occurences.has(item) ? occurences.get(item) + 1 : 1);
    }
    return occurences;
}

const fitInOccurences = (items, occurences) => {
    const itemOccurences = countOccurences(items);
    for (const [item, countNeeded] of itemOccurences) {
        const countExisting = occurences.get(item) || 0;
        if (countNeeded > countExisting) {
            return false;
        }
    }
    return true;
}

const constructArea = (lines) => {
    const map = new Map()

    for (const [y, line] of lines.entries()) {
        const lineMap = new Map();
        const chars = line.split('');
        for (const [x, char] of chars.entries()) {
            lineMap.set(x, char);
        }
        map.set(y, lineMap);
    }

    const maxX = lines[0].length - 1;
    const maxY = lines.length - 1;

    return new Area(maxX, maxY, map);
}

module.exports = {
    countOccurences,
    fitInOccurences,
    constructArea
}