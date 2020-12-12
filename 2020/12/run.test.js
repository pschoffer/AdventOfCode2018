const each = require('jest-each').default;
const { Ship, ShipWithWaypoint, parseInstr } = require('./run')
const { Point } = require('../utils/area');


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


    each([
        [
            new Point(10, 5),
            'L90',
            new Point(5, -10),
        ],
        [
            new Point(10, 5),
            'L180',
            new Point(-10, -5),
        ],
        [
            new Point(10, 5),
            'L270',
            new Point(-5, 10),
        ],
        [
            new Point(10, 5),
            'R90',
            new Point(-5, 10),
        ],
        [
            new Point(10, 5),
            'R450',
            new Point(-5, 10),
        ]
    ]).test('Test WAYPOINT L/R %p %p', (waypoint, instr, expected) => {
        const ship = new ShipWithWaypoint()
        ship.waypoint = waypoint;

        ship.processInstruction(parseInstr(instr));

        expect(`${ship.waypoint}`).toBe(`${expected}`);
    });

});
