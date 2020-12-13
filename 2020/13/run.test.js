const each = require('jest-each').default;
const { lowestMultiplyer } = require('./run')


describe("Day13 ", () => {
    each([
        [
            [2, 4, 8],
            8
        ],
        [
            [2, 3, 8],
            24
        ],
    ]).test('Lowest multiplyer %p', (input, expected) => {
        const result = lowestMultiplyer(input);

        expect(result).toBe(expected);
    });



});
