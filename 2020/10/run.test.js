const each = require('jest-each').default;
const { countVariants } = require('./run')


describe("Day10 ", () => {
    each([
        [

            {
                beforeDiff: 1,
                variables: [1],
                afterDiff: 3
            },
            1
        ],
        [

            {
                beforeDiff: 1,
                variables: [5],
                afterDiff: 2
            },
            2
        ],
        [

            {
                beforeDiff: 1,
                variables: [5, 6],
                afterDiff: 1
            },
            4
        ],
        [

            {
                beforeDiff: 2,
                variables: [5, 6],
                afterDiff: 2
            },
            3
        ],

        [

            {
                beforeDiff: 1,
                variables: [5, 6, 8, 9, 11, 12],
                afterDiff: 2
            },
            21
        ],
    ]).test('Test count variant %p', (varibaleGroup, expected) => {
        const result = countVariants(varibaleGroup);
        expect(result).toBe(expected);
    });


});
