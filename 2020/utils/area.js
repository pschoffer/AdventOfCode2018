const { range } = require("./interval");

const directExploder = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
]

const diagonalExploder = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
]
class Area {
    constructor(maxX, maxY, map) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.map = map;
        this.cornerPoint = new Point(maxX, maxY);
        this.cache = new Map();
    }

    setPointValue(point, value) {
        if (!this.map.has(point.y)) {
            this.map.set(point.y, new Map())
        }
        this.map.get(point.y).set(point.x, value);
    }

    getPointValue(point) {
        return this.map.get(point.y).get(point.x);
    }

    getPointValues(points) {
        return points.map(p => this.map.get(p.y).get(p.x))
    }

    flip() {
        const newMap = new Map();
        for (let y = 0; y <= this.maxY; y++) {
            const newLine = new Map();
            for (let x = 0; x <= this.maxX; x++) {
                newLine.set(x, this.map.get(this.maxY - y).get(x));
            }

            newMap.set(y, newLine)
        }
        return new Area(this.maxX, this.maxY, newMap);
    }

    removeBorder() {
        const map = new Map();

        for (const point of this.pointIterator()) {
            if (point.x === 0 || point.x === this.maxX || point.y === this.maxY || point.y === 0) {
                continue
            }
            if (!map.has(point.y - 1)) {
                map.set(point.y - 1, new Map())
            }
            map.get(point.y - 1,).set(point.x - 1, this.getPointValue(point));
        }

        return new Area(this.maxX - 2, this.maxY - 2, map)
    }

    rotateCounter(times = 1) {
        const newArea = new Area(this.maxX, this.maxY, new Map());

        for (const point of this.pointIterator()) {
            const newPoint = new Point(point.y, this.maxY - point.x);
            newArea.setPointValue(newPoint, this.getPointValue(point))
        }

        if (times > 1) {
            return newArea.rotateCounter(times - 1)
        } else {
            return newArea;
        }

    }

    lines() {
        const lines = [];
        for (let y = 0; y <= this.maxY; y++) {

            lines.push(this.getRow(y));
        }
        return lines;
    }

    getRow(ix) {
        const rowMap = this.map.get(ix);
        const row = [];

        if (rowMap) {
            for (let x = 0; x <= this.maxX; x++) {
                row.push(rowMap.get(x));
            }
        }

        return row;
    }

    getColumn(x) {
        const column = [];

        for (let y = 0; y <= this.maxY; y++) {
            column.push(this.map.get(y).get(x));
        }

        return column;
    }

    print() {
        let legend = "   ";
        for (let ixX = 0; ixX <= this.maxX; ixX++) {
            legend = legend + " " + ixX + (ixX > 9 ? "" : " ");
        }
        console.log(legend);
        for (let ixY = 0; ixY <= this.maxY; ixY++) {
            let line = `${ixY} ` + (ixY > 9 ? '' : ' ');

            for (let ixX = 0; ixX <= this.maxX; ixX++) {
                line += " " + this.map.get(ixY).get(ixX) + " ";
            }

            console.log(line);
        }
    }

    pointIterator() {
        const points = [];
        for (let ixY = 0; ixY <= this.maxY; ixY++) {
            for (let ixX = 0; ixX <= this.maxX; ixX++) {
                points.push(new Point(ixX, ixY));
            }
        }
        return points;
    }

    getNeighbours(point, { includeDiagonal, extendDirection, extendDirectionStop } = { includeDiagonal: false, extendDirection: false, extendDirectionStop: [] }) {
        const cacheKey = `neighbour_${point.x}_${point.y}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let neighbours;
        const adjustments = includeDiagonal ? directExploder.concat(diagonalExploder) : directExploder;

        if (extendDirection) {
            let shifter = 0;
            let remainingAdjustments = [...adjustments];
            neighbours = [];
            while (remainingAdjustments.length) {
                let newRemainingAdjustments = [];

                for (const adjustmentBase of remainingAdjustments) {
                    const adjustment = adjustmentBase.map(coordinate => coordinate ? coordinate + (shifter * coordinate) : coordinate);
                    const adjustmentPoint = new Point(adjustment[0], adjustment[1]);
                    const adjustedPoint = point.adjust(adjustmentPoint, { cornerPointHigh: this.cornerPoint, cornerPointLow: new Point(0, 0) });



                    if (adjustedPoint) {
                        if (extendDirectionStop.includes(this.getPointValue(adjustedPoint))) {
                            neighbours.push(adjustedPoint)
                        } else {
                            newRemainingAdjustments.push(adjustmentBase);
                        }
                    }


                    // if (point.y === 7 && point.x === 9) {
                    //     console.log("Checking Neighbours", point)
                    //     console.log(shifter, adjustment, neighbours, newRemainingAdjustments);
                    // }
                }

                shifter++;
                remainingAdjustments = newRemainingAdjustments;
            }

        } else {
            neighbours = adjustments
                .map(([x, y]) => new Point(x, y))
                .map(adj => point.adjust(adj, { cornerPointHigh: this.cornerPoint, cornerPointLow: new Point(0, 0) }))
                .filter(p => !!p);
        }

        this.cache.set(cacheKey, neighbours);
        return neighbours;
    }

    countValue(value) {
        let count = 0;

        for (const point of this.pointIterator()) {
            if (this.getPointValue(point) === value) {
                count++;
            }
        }

        return count;
    }
}


const DIMENSION_MAP = {
    0: 'x',
    1: 'y',
    2: 'z',
    3: 'w'
}

class AreaXD {
    constructor(dimension = 3) {
        this.map = new Map()
        this.dimensionCount = dimension;
        this.resetBounds(dimension)
    }

    resetBounds() {
        const subBounds = {};
        this.getDimensions().forEach(d => subBounds[d] = null);
        this.bounds = { min: { ...subBounds }, max: { ...subBounds } };
    }

    maybeUpdateBounds(values, dimension) {
        this.bounds.min[dimension] = this.bounds.min[dimension] === null ? Math.min(...values) : Math.min(...values, this.bounds.min[dimension]);
        this.bounds.max[dimension] = this.bounds.max[dimension] === null ? Math.max(...values) : Math.max(...values, this.bounds.max[dimension]);
    }

    getDimensions() {
        return range(0, this.dimensionCount - 1).map(dIx => DIMENSION_MAP[dIx]);
    }

    updateAllBounds(depth = this.dimensionCount - 1, map = null) {
        if (depth === this.dimensionCount - 1) {
            this.resetBounds();
            map = this.map;
        }
        if (depth < 0) {
            return;
        }

        const keys = [...map.keys()];
        this.maybeUpdateBounds(keys, DIMENSION_MAP[depth]);
        keys.forEach(key => {
            this.updateAllBounds(depth - 1, map.get(key))
        })
    }

    add2DArea(area, ...args) {
        const dimensions = args || [];

        while (dimensions.length < this.dimensionCount - 2) {
            dimensions.unshift(0);
        }

        let map = this.map;
        while (dimensions.length > 1) {
            const nextDimension = dimensions.shift();
            if (!map.has(nextDimension)) {
                map.set(nextDimension, new Map())
            }
            map = this.map.get(nextDimension)
        }

        map.set(dimensions.shift(), area);
        this.updateAllBounds();
    }

    iterate({ useBounds = false, boundsAdjustment = 0 } = {}, { depth, map, boundKeys, pastCoordinates } = { depth: this.dimensionCount - 1, map: this.map, pastCoordinates: [] }) {
        if (depth === this.dimensionCount - 1) {
            boundKeys = {}
            const coordinates = this.getDimensions();
            coordinates.forEach(coordinate => boundKeys[coordinate] = range(this.bounds.min[coordinate] - boundsAdjustment, this.bounds.max[coordinate] + boundsAdjustment))

        }

        const keys = useBounds ? boundKeys[DIMENSION_MAP[depth]] : [...map.keys()]
        keys.sort((a, b) => a - b);


        let allPoints = [];
        for (const key of keys) {
            const coordinates = [...pastCoordinates];
            coordinates.unshift(key)
            if (depth <= 0) {
                allPoints.push([new PointXD(...coordinates), map && map.get(key)]);
            } else {
                allPoints = allPoints.concat(this.iterate(
                    { useBounds, boundsAdjustment },
                    { depth: depth - 1, map: map && map.get(key), boundKeys, pastCoordinates: coordinates }
                ))
            }
        }


        return allPoints;
    }

    addPoint(point, value) {
        const coordinates = [...point.coordinate];

        let map = this.map;
        while (coordinates.length > 1) {
            const lastCoordinate = coordinates.pop();
            if (!map.has(lastCoordinate)) {
                map.set(lastCoordinate, new Map());
            }
            map = map.get(lastCoordinate);
        }

        map.set(coordinates.pop(), value);
    }

    removePoint(point, { depth, map } = { depth: 0, map: this.map }) {
        const coordinates = [...point.coordinate];
        const coordinate = coordinates[coordinates.length - 1 - depth];

        if (depth === coordinates.length - 1) {
            map.delete(coordinate);
        } else {
            const childMap = map.get(coordinate);
            this.removePoint(point, { depth: depth + 1, map: childMap })
            if (childMap.size === 0) {
                map.delete(coordinate)
            }
        }
    }

    get(point) {
        let map = this.map;
        const coordinates = [...point.coordinate];

        while (coordinates.length > 1) {
            const newMap = map.get(coordinates.pop());
            if (!newMap) {
                return newMap;
            }

            map = newMap
        }
        return map.get(coordinates.pop());
    }

    remove(value) {
        for (const [point, pointValue] of this.iterate()) {
            if (pointValue === value) {
                this.removePoint(point);
            }
        }
        this.updateAllBounds()

    }

    count(value = null) {
        let count = 0;

        for (const [point, pointValue] of this.iterate()) {
            if (value === null || pointValue === value) {
                count++;
            }
        }

        return count
    }

    print() {
        const points = this.iterate({ useBounds: true });
        let currentZ = null;
        let currentY = null;
        let currentLine = "";
        for (const [point, value] of points) {
            if (point.z !== currentZ) {
                if (currentLine) {
                    console.log(currentLine);
                    currentLine = null;
                }
                console.log("\nLayer z: ", point.z);
                const legend = range(this.bounds.min.y, this.bounds.max.y)
                    .map(ix => ix >= 10 ? `${ix}` : `${ix} `)
                    .join(" ");
                console.log("    " + legend);
                currentZ = point.z
                currentY = null;
            }
            if (point.y !== currentY) {
                if (currentLine) {
                    console.log(currentLine);
                }
                currentLine = point.y >= 10 ? `${point.y} ` : `${point.y}  `;
                currentY = point.y;
            }
            currentLine += ` ${value || '.'} `;

        }
        console.log(currentLine);
    }

}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    adjust(adjustment, { cornerPointHigh, cornerPointLow, wrapX = false } = {}) {
        const adjusted = new Point(this.x + adjustment.x, this.y + adjustment.y);
        if (cornerPointHigh) {
            const isOverX = adjusted.x > cornerPointHigh.x;
            const isOverY = adjusted.y > cornerPointHigh.y;
            if ((isOverX && !wrapX) || isOverY) {
                return null;
            }

            if (isOverX) {
                adjusted.x = adjusted.x % (cornerPointHigh.x + 1);
            }
        }

        if (cornerPointHigh) {
            const isBelowX = adjusted.x < cornerPointLow.x;
            const isBelowY = adjusted.y < cornerPointLow.y;
            if (isBelowX || isBelowY) {
                return null;
            }
        }


        return adjusted;
    }

    manhaton(from = new Point(0, 0)) {
        return Math.abs(this.x - from.x) + Math.abs(this.y - from.y);
    }

    multiply(multiplier) {
        return new Point(this.x * multiplier, this.y * multiplier);
    }

    multiplyPoint(multiplier) {
        return new Point(this.x * multiplier.x, this.y * multiplier.y);
    }

    abs() {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }


    switch() {
        return new Point(this.y, this.x);
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}


class PointXD {
    constructor(...args) {
        this.coordinate = args;
    }

    get x() {
        return this.coordinate[0];
    }

    get y() {
        return this.coordinate[1];
    }

    get z() {
        return this.coordinate[2];
    }
    get w() {
        return this.coordinate[3];
    }

    isSame(point) {
        if (this.coordinate.length !== point.coordinate.length) {
            return false;
        }

        for (let ix = 0; ix < this.coordinate.length; ix++) {
            if (this.coordinate[ix] !== point.coordinate[ix]) {
                return false;
            }

        }
        return true;
    }

    neighbours() {
        let neighbours = [];
        for (const co of this.coordinate) {
            if (neighbours.length) {
                neighbours = [-1, 0, 1]
                    .map(adj => {
                        return neighbours
                            .map(existing => {
                                return existing.concat([co + adj]);
                            })
                    })
                    .reduce((prev, curr) => prev.concat(curr), [])
            } else {
                neighbours = [[co - 1], [co], [co + 1]]
            }
        }

        const neighbourPoints = neighbours
            .map(co => new PointXD(...co))
            .filter(co => !this.isSame(co));

        return neighbourPoints;
    }
}

module.exports = {
    Area,
    AreaXD,
    Point,
    PointXD
}