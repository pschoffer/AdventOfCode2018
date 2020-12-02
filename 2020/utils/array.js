
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

module.exports = {
    countOccurences,
    fitInOccurences
}