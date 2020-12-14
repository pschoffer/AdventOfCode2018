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

});
