const each = require('jest-each').default;
const { AreaXD, PointXD, Area } = require('./area')
const { constructArea } = require('./array')

describe("Area", () => {

    each([
        [
            [
                '000',
                '010',
                '000',
            ],
            ['1']
        ],
        [
            [
                '0000',
                '0220',
                '0000',
                '0000',
            ],
            ['2', '2']
        ],
    ]).test('removeBorder', (lines, expected) => {
        const area = constructArea(lines)

        const areaWithoutBorder = area.removeBorder();

        const result = areaWithoutBorder.getRow(0)
        expect(result).toStrictEqual(expected);
    })

    each([
        [
            [
                '1000',
                '0220',
                '0030',
                '1004',
            ],
            1,
            [
                ['0', '0', '0', '4'],
                ['0', '2', '3', '0'],
                ['0', '2', '0', '0'],
                ['1', '0', '0', '1'],
            ]
        ],
        [
            [
                '1000',
                '0220',
                '0030',
                '1004',
            ],
            2,
            [
                ['4', '0', '0', '1'],
                ['0', '3', '0', '0'],
                ['0', '2', '2', '0'],
                ['0', '0', '0', '1'],
            ]
        ],
    ]).test('rotateCounter', (lines, times, expected) => {
        const area = constructArea(lines)

        const rotated = area.rotateCounter(times);

        for (let ix = 0; ix < expected.length; ix++) {
            const result = rotated.getRow(ix)

            expect(result).toStrictEqual(expected[ix]);
        }
    })


    each([
        [
            [
                '1000',
                '0220',
                '0030',
                '1004',
            ],
            [
                ['1', '0', '0', '0'],
                ['0', '2', '2', '0'],
                ['0', '0', '3', '0'],
                ['1', '0', '0', '4'],
            ]
        ],
    ]).test('lines', (lines, expected) => {
        const area = constructArea(lines)

        const result = area.lines();

        expect(result).toStrictEqual(expected);
    })
})

describe("AreaXD ", () => {
    const line0 = new Map();
    line0.set(0, '.')
    line0.set(1, '.')
    line0.set(2, '.')
    const line1 = new Map();
    line1.set(0, '.')
    line1.set(1, '#')
    line1.set(2, '.')
    const line2 = new Map();
    line2.set(0, '.')
    line2.set(1, '.')
    line2.set(2, '#')
    const baseLayer = new Map();
    baseLayer.set(0, line0)
    baseLayer.set(1, line1)
    baseLayer.set(2, line2)


    const oneItemline = new Map();
    oneItemline.set(0, '#')
    const oneItemLayer = new Map();
    oneItemLayer.set(0, oneItemline);

    each([
        [
            baseLayer,
            null,
            9
        ],
        [
            baseLayer,
            '#',
            2
        ],
        [
            baseLayer,
            '.',
            7
        ],

    ]).test('count %p %p', (map, value, expected) => {
        const area = new AreaXD();
        area.add2DArea(map);

        const result = area.count(value);

        expect(result).toStrictEqual(expected);
    });

    each([
        [
            baseLayer,
            2,
            [0, 1, 1],
            [0, 2, 2]
        ]
    ]).test('remove %p', (map, expectedCount, expectedMin, expectedMax) => {
        const area = new AreaXD();
        area.add2DArea(map);

        area.remove('.');

        const count = area.count();
        expect(count).toStrictEqual(expectedCount);
        const dimensions = ['z', 'y', 'x'];
        expect(dimensions.map(d => area.bounds.min[d])).toStrictEqual(expectedMin)
        expect(dimensions.map(d => area.bounds.max[d])).toStrictEqual(expectedMax)
    });

    each([
        [
            baseLayer,
            {},
            [
                new PointXD(1, 1, 0),
                new PointXD(2, 2, 0),
            ]
        ],
        [
            baseLayer,
            { useBounds: true },
            [
                new PointXD(1, 1, 0),
                new PointXD(2, 1, 0),
                new PointXD(1, 2, 0),
                new PointXD(2, 2, 0),
            ]
        ],
        [
            oneItemLayer,
            { useBounds: true, boundsAdjustment: 1 },
            [
                new PointXD(-1, -1, -1),
                new PointXD(0, -1, -1),
                new PointXD(1, -1, -1),

                new PointXD(-1, 0, -1),
                new PointXD(0, 0, -1),
                new PointXD(1, 0, -1),

                new PointXD(-1, 1, -1),
                new PointXD(0, 1, -1),
                new PointXD(1, 1, -1),


                new PointXD(-1, -1, 0),
                new PointXD(0, -1, 0),
                new PointXD(1, -1, 0),

                new PointXD(-1, 0, 0),
                new PointXD(0, 0, 0),
                new PointXD(1, 0, 0),

                new PointXD(-1, 1, 0),
                new PointXD(0, 1, 0),
                new PointXD(1, 1, 0),


                new PointXD(-1, -1, 1),
                new PointXD(0, -1, 1),
                new PointXD(1, -1, 1),

                new PointXD(-1, 0, 1),
                new PointXD(0, 0, 1),
                new PointXD(1, 0, 1),

                new PointXD(-1, 1, 1),
                new PointXD(0, 1, 1),
                new PointXD(1, 1, 1),
            ]
        ]
    ]).test('iterate with removal %p %p', (map, options, expectedPoints) => {
        const area = new AreaXD();
        area.add2DArea(map, 0);

        area.remove('.');

        const points = area.iterate(options).map(([point]) => point);
        expect(points.length).toStrictEqual(expectedPoints.length);

        for (let ix = 0; ix < expectedPoints.length; ix++) {
            expect(points[ix].coordinate).toStrictEqual(expectedPoints[ix].coordinate);

        }
    });
});


describe("PointXD ", () => {


    each([
        [
            [0, 1, 2, 3],
            'x',
            0
        ],

        [
            [0, 1, 2, 3],
            'z',
            2
        ]
    ]).test('getter %p %p', (coordinates, dimension, expected) => {
        const point = new PointXD(...coordinates);

        const result = point[dimension];

        expect(result).toStrictEqual(expected);
    });

    each([

        [
            [5],
            [
                [4],
                [6]
            ]
        ],
        [
            [0, 0],
            [
                [-1, -1],
                [0, -1],
                [1, -1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [0, 1],
                [1, 1],
            ]
        ],
    ]).test('neighbours %p %p', (coordinates, expected) => {
        const point = new PointXD(...coordinates);

        const result = point.neighbours();

        expect(result.map(r => r.coordinate)).toStrictEqual(expected);
    });


});
