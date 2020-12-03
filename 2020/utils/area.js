class Area {
    constructor(maxX, maxY, map) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.map = map;
        this.cornerPoint = new Point(maxX, maxY);
    }

    getPointValues(points) {
        return points.map(p => this.map.get(p.y).get(p.x))
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



        return adjusted;
    }
}

module.exports = {
    Area,
    Point
}