const each = require('jest-each').default;
const { range } = require('./interval')


describe("range ", () => {

    each([
        [
            [3],
            [0, 1, 2, 3]
        ],
        [
            [-1, 2],
            [-1, 0, 1, 2]
        ]

    ]).test('works %p', (args, expected) => {
        const result = range(...args);

        expect(result).toStrictEqual(expected);
    });

});
