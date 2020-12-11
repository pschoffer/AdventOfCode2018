
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

    getNeighbours(point, { includeDiagonal } = { includeDiagonal: false }) {
        const adjustments = includeDiagonal ? directExploder.concat(diagonalExploder) : directExploder;
        const candidates = adjustments
            .map(([x, y]) => new Point(x, y))
            .map(adj => point.adjust(adj, { cornerPointHigh: this.cornerPoint, cornerPointLow: new Point(0, 0) }))
            .filter(p => !!p);
        return candidates;
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

    adjust(adjustment, { cornerPointHigh, cornerPointLow, wrapX = false }) {
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
}

module.exports = {
    Area,
    Point
}