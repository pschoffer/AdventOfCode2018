const each = require('jest-each').default;
const { getBorders, getBorderAfterAdjustment } = require('./run')
const { constructArea } = require('../utils/array')


describe("Day20 ", () => {
    each([
        [
            [
                '.*',
                '*.'
            ],
            [
                ['.', '*'],
                ['*', '.'],
                ['.', '*'],
                ['*', '.'],
            ]
        ],
        [
            [
                '..*',
                '*..'
            ],
            [
                ['.', '.', '*'],
                ['*', '.'],
                ['.', '.', '*'],
                ['*', '.'],
            ]
        ],
    ]).test('getBorders %p', (lines, expected) => {
        const area = constructArea(lines);

        const result = getBorders(area)

        expect(result).toStrictEqual(expected);
    });

    each([
        [
            [
                '.*',
                '*.'
            ],
            false,
            0,
            1,
            ['*', '.']
        ],
        [
            [
                '.0*',
                '3.1',
                '*2.'
            ],
            false,
            1,
            1,
            ['.', '2', '*']
        ],
        [
            [
                '.0*',
                '3.1',
                '*2.'
            ],
            false,
            2,
            1,
            ['*', '3', '.']
        ],
        [
            [
                '.0*',
                '3.1',
                '*2.'
            ],
            false,
            3,
            1,
            ['.', '0', '*']
        ],
    ]).test('getBorders %p', (lines, flipped, rotated, ix, expected) => {
        const area = constructArea(lines);
        const flippedArea = area.flip();
        const borders = {
            regular: getBorders(area),
            flipped: getBorders(flippedArea)
        };

        const result = getBorderAfterAdjustment(borders, ix, flipped, rotated)

        expect(result).toStrictEqual(expected);
    });

});
