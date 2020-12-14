const each = require('jest-each').default;
const { Runner } = require('./runner')


describe("Runner ", () => {
    each([
        [
            'x10x',
            {
                orMask: {
                    higher: 0,
                    lower: 0b0100,
                },
                andMask: {
                    higher: 0,
                    lower: 0b1101
                }
            }
        ],
        [
            (Math.pow(2, 35) + 3).toString(2),
            {
                orMask: {
                    higher: Math.pow(2, 7),
                    lower: 3,
                },
                andMask: {
                    higher: Math.pow(2, 7),
                    lower: 3
                }
            }
        ],
    ]).test('parseMask %p', (input, expected) => {
        const result = new Runner().parseMask(input);

        expect(result).toStrictEqual(expected);
    });

    each([
        [
            'x10x',
            {
                orMask: {
                    higher: 0,
                    lower: 0b0100,
                },
                floatBits: [
                    {
                        higher: 0,
                        lower: 0b0001
                    },
                    {
                        higher: 0,
                        lower: 0
                    },
                    {
                        higher: 0,
                        lower: 0b1001
                    },
                    {
                        higher: 0,
                        lower: 0b1000
                    },
                ]
            }
        ],
        [
            'X' + Math.pow(2, 35).toString(2),
            {
                orMask: {
                    higher: Math.pow(2, 7),
                    lower: 0,
                },
                floatBits: [
                    {
                        higher: Math.pow(2, 8),
                        lower: 0
                    },

                    {
                        higher: 0,
                        lower: 0
                    }
                ]
            }
        ],
    ]).test('parseMask v2 %p', (input, expected) => {
        const result = new Runner([], { maskVersion: 2 }).parseMask(input);

        expect(result).toStrictEqual(expected);
    });

    each([
        [
            [
                { instructionCode: 'mask', args: ['x10x'] },
                { instructionCode: 'mem', args: [0, 0b1011] }
            ],
            [0, 0b1101],

        ],
        [
            [

                { instructionCode: 'mask', args: [(Math.pow(2, 35) + Math.pow(2, 32) + 2).toString(2)] },
                { instructionCode: 'mem', args: [0, Math.pow(2, 32) + 3] }
            ],
            [0, Math.pow(2, 35) + Math.pow(2, 32) + 2]
        ],
    ]).test('Execute mask %p', (program, [expectedAddr, expectedValue]) => {
        const runner = new Runner(program);
        runner.execute();

        expect(runner.memory[expectedAddr]).toStrictEqual(expectedValue);
    });

    each([
        [
            [
                { instructionCode: 'mask', args: ['000000'] },
                { instructionCode: 'mem', args: [42, 100] }
            ],
            [
                [42, 100],
            ],

        ],
        [
            [
                { instructionCode: 'mask', args: ['X1001X'] },
                { instructionCode: 'mem', args: [42, 100] }
            ],
            [
                [26, 100],
                [27, 100],
                [58, 100],
                [59, 100],
            ],

        ],
    ]).test('Execute mask v2 %p', (program, expected) => {
        const runner = new Runner(program, { maskVersion: 2 });
        runner.execute();
        for (const [address, value] of expected) {
            expect(runner.memory[address]).toStrictEqual(value);
        }
    });

});
