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
    const players = [
        [],
        []
    ]

    let playerIx = -1;
    for (const line of lines) {
        if (line.match(/Player/)) {
            playerIx++;
        } else if (line) {
            players[playerIx].push(Number(line))
        }
    }

    return players

}


const run = async () => {
    const lines = (await readFileLines(inputPath));

    const decks = parseInput(lines);


    while (decks.filter(deck => deck.length).length > 1) {
        const cards = [0, 1].map(ix => decks[ix].shift());
        if (cards[0] > cards[1]) {
            decks[0].push(...cards);
        } else {
            cards.reverse();
            decks[1].push(...cards);
        }
    }

    const winningDeck = decks.filter(d => d.length)[0]
    let multiplier = winningDeck.length;

    const result = winningDeck.reduce((prev, curr) => prev + curr * (multiplier--), 0)

    console.log(decks, result);
}

run()

// ------------------------------- Part 2 -------------------------------
