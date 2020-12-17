
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
        this.map.get(point.y).set(point.x, value);
    }

    getPointValue(point) {
        return this.map.get(point.y).get(point.x);
    }

    getPointValues(points) {
        return points.map(p => this.map.get(p.y).get(p.x))
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


class Area3D {
    constructor() {
        this.map = new Map()
        this.resetBounds()
    }

    resetBounds() {
        const subBounds = { z: null, y: null, x: null };
        this.bounds = { min: { ...subBounds }, max: { ...subBounds } };
    }

    maybeUpdateBounds(values, dimension) {
        this.bounds.min[dimension] = this.bounds.min[dimension] === null ? Math.min(...values) : Math.min(...values, this.bounds.min[dimension]);
        this.bounds.max[dimension] = this.bounds.max[dimension] === null ? Math.max(...values) : Math.max(...values, this.bounds.max[dimension]);
    }

    updateAllBounds() {
        this.resetBounds();

        const zKeys = [...this.map.keys()];
        this.maybeUpdateBounds(zKeys, 'z');

        zKeys.forEach(z => {
            const yKeys = [...this.map.get(z).keys()]
            this.maybeUpdateBounds(yKeys, 'y');
            yKeys.forEach(y => this.maybeUpdateBounds([...this.map.get(z).get(y).keys()], 'x'));
        });

    }

    add2DArea(area, z = 0) {
        this.map.set(z, area);
        this.updateAllBounds();
    }

    iterate() {
        const allPoints = [];
        const zKeys = [...this.map.keys()]
        zKeys.sort();

        for (const z of zKeys) {
            const yKeys = [...this.map.get(z).keys()]
            yKeys.sort();
            for (const y of yKeys) {
                const xKeys = [...this.map.get(z).get(y).keys()]
                xKeys.sort();
                for (const x of xKeys) {
                    allPoints.push([new Point3D(z, y, x), this.map.get(z).get(y).get(x)]);
                }
            }
        }


        return allPoints;
    }

    removePoint(point) {
        this.map.get(point.z).get(point.y).delete(point.x)
        if (this.map.get(point.z).get(point.y).size === 0) {
            this.map.get(point.z).delete(point.y);
            if (this.map.get(point.z).size === 0) {
                this.map.delete(point.z)
            }
        }
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
        const keys = [...this.map.keys()]
        keys.sort();

        for (const key of keys) {
            console.log("Z ix: " + key);
            this.map.get(key).print();
            console.log("\n");
        }
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


class Point3D {
    constructor(z, y, x) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

module.exports = {
    Area,
    Area3D,
    Point
}