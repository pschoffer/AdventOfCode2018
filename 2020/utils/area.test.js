const each = require('jest-each').default;
const { Area3D } = require('./area')


describe("Area3D ", () => {


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
        const area = new Area3D();
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
        const area = new Area3D();
        area.add2DArea(map);

        area.remove('.');

        const count = area.count();
        expect(count).toStrictEqual(expectedCount);
        const dimensions = ['z', 'y', 'x'];
        expect(dimensions.map(d => area.bounds.min[d])).toStrictEqual(expectedMin)
        expect(dimensions.map(d => area.bounds.max[d])).toStrictEqual(expectedMax)
    });


});
