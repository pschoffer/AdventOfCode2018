const each = require('jest-each').default;
const { Ship, parseInstr } = require('./run')


describe("Day12 ", () => {
    each([
        [

            0,
            'L90',
            3
        ],
        [

            0,
            'L180',
            2
        ],
        [

            0,
            'L270',
            1
        ],
        [

            0,
            'L360',
            0
        ],
        [

            0,
            'L450',
            3
        ],
        [

            0,
            'R180',
            2
        ],
        [

            0,
            'R90',
            1
        ],

        [

            1,
            'L90',
            0
        ]
    ]).test('Test L/R %p %p', (startIx, instr, expected) => {
        const ship = new Ship()
        ship.directionIx = startIx;

        ship.processInstruction(parseInstr(instr));

        expect(ship.directionIx).toBe(expected);
    });


});
