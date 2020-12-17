class Interval {

    constructor(lower, upper) {
        if (upper !== undefined) {
            this.bounds = [lower, upper]
        } else {
            this.bounds = [0, lower - 1]
        }
        this.size = this.bounds[1] - this.bounds[0] + 1;
        this.midpoint = this.bounds[0] + Math.floor((this.bounds[1] - this.bounds[0]) / 2);
    }

    binaryDivide(instructions) {
        if (instructions.length) {
            const instruction = instructions.shift();
            const half = instruction === 'LOW' ? this.getLowerHalf() : this.getUpperHalf();
            return half.binaryDivide(instructions);
        }
        return this;
    }

    getLowerHalf() {
        return new Interval(this.bounds[0], this.midpoint);
    }

    getUpperHalf() {
        return new Interval(this.midpoint + 1, this.bounds[1]);
    }

    contains(number) {
        return number <= this.bounds[1] && number >= this.bounds[0];
    }

    toString() {
        return `${this.bounds[0]}-${this.bounds[1]}`
    }

    range() {
        const range = [];
        for (let item = this.bounds[0]; item <= this.bounds[1]; item++) {
            range.push(item);

        }
        return range;
    }
}

const range = (...args) => {
    let interval = new Interval(...args);
    if (args.length === 1) {
        interval = new Interval(args[0] + 1);

    }
    return interval.range();
}

module.exports = {
    Interval,
    range
}