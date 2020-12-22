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
// inputPath = path.join(__dirname, 'test2.txt');


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

// run()

// ------------------------------- Part 2 -------------------------------

const game = (decks) => {
    const stateCache = new Set();


    let round = 1;
    while (decks.filter(deck => deck.length).length > 1) {
        const cacheKey = decks
            .map(deck => deck.join(","))
            .join("|");
        if (stateCache.has(cacheKey)) {
            return {
                winner: 1,
                winningDeck: decks[0]
            }
        } else {
            stateCache.add(cacheKey);
        }


        const cards = [0, 1].map(ix => decks[ix].shift());
        const shouldDoSub = [0, 1]
            .filter(ix => cards[ix] <= decks[ix].length)
            .length === 2


        let player1Wins = true
        if (shouldDoSub) {
            const decksCopy = JSON.parse(JSON.stringify(decks));
            const subDecks = [0, 1].map(ix => decksCopy[ix].splice(0, cards[ix]));
            const subResult = game(subDecks);
            player1Wins = subResult.winner === 1;
        } else {
            player1Wins = cards[0] > cards[1];
        }

        if (player1Wins) {
            decks[0].push(...cards);
        } else {
            cards.reverse();
            decks[1].push(...cards);
        }
    }

    const winner = [0, 1].filter(ix => decks[ix].length).map(ix => ix + 1)[0]

    return {
        winner,
        winningDeck: decks[winner - 1]
    }
}


const run2 = async () => {
    const lines = (await readFileLines(inputPath));

    const decks = parseInput(lines);

    const { winner, winningDeck } = game(decks)

    let multiplier = winningDeck.length;

    const result = winningDeck.reduce((prev, curr) => prev + curr * (multiplier--), 0)

    console.log("Final", winner, winningDeck, result);
}

run2()