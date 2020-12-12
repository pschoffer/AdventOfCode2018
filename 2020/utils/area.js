
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

module.exports = {
    Area,
    Point
}