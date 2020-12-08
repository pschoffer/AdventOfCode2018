class PathFinder {
    constructor() {
        this.cache = {}
        this.missCache = {}
        this.resetSearch();
        this.debug = false;
    }

    resetSearch() {
        this.queue = {};
    }

    dijkstraAlgorithm(start, target, exploder) {
        this.start = start;
        this.resetSearch();
        this.push([start, 0])
        const lenght = this._dijsktraStep(target, exploder)
        const cacheKey = `${start}_${target}`;
        if (this.debug) {
            console.log(`setting cache on ${cacheKey} - ${lenght}`);
        }
        this.cache[cacheKey] = lenght;
        return lenght;
    }

    push(newItem) {
        const [id, distance] = newItem;
        if (this.queue[id] === undefined || this.queue[id] > distance) {
            this.queue[id] = distance
        }
    }

    pop() {
        const keys = Object.keys(this.queue);

        if (keys.length) {
            let currentLowest = null;
            let currentLowestKey = null;
            for (const key of keys) {
                if (currentLowest === null || currentLowest > this.queue[key]) {
                    currentLowest = this.queue[key];
                    currentLowestKey = key;
                }
            }

            const result = [currentLowestKey, this.queue[currentLowestKey]];
            delete this.queue[currentLowestKey];
            return result;
        } else {
            return null;
        }
    }

    queueSize() {
        return Object.keys(this.queue).length
    }

    _dijsktraStep(target, exploder) {

        const top = this.pop();
        if (top === null) {
            return null
        }
        if (this.debug) {
            console.log(`trying ${top[0]}`, this.queue);
        }
        const cacheKey = `${top[0]}_${target}`;
        if (this.cache[cacheKey]) {
            if (this.debug) {
                console.log(`Hit the cache ${top[0]} - ${cacheKey}`);
            }
            return this.cache[cacheKey] + top[1];
        }
        if (this.missCache[cacheKey]) {
            return null;
        }
        if (top[0] === target) {
            return top[1];
        }

        const newItems = exploder(...top)
            .filter(([item]) => !this.missCache[`${item}_${target}`]);

        if (newItems.length === 0) {
            if (this.debug) {
                console.log(`Nothing new ${top[0]} returning null`);
            }
            return null;
        }

        for (const newItem of newItems) {
            this.push(newItem);
        }

        let result = this._dijsktraStep(target, exploder);
        while (result === null && this.queueSize()) {
            if (this.debug) {
                console.log(`Got null ${top[0]} checking more`);
            }
            result = this._dijsktraStep(target, exploder);
        }
        if (result === null) {
            // this.missCache[cacheKey] = true;

            // console.log(`Missed ${top[0]}`, this);
        } else {

            // console.log(`found ${top[0]}`, this);
            return result;
        }
        return null;
    }
}



module.exports = {
    PathFinder
}