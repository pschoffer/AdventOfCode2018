const path = require('path');
const { Point, AreaXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');
// inputPath = path.join(__dirname, 'test2.txt');


class Expression {
    constructor() {
        this.items = [];
    }

    increasePrioSubExpressions(op) {
        this.items
            .filter(element => element instanceof Expression)
            .forEach(expr => expr.increasePrio(op));
    }

    increasePrio(op) {
        this.increasePrioSubExpressions(op);


        let newItems = [];

        for (let ix = 0; ix < this.items.length; ix++) {
            const element = this.items[ix];
            if (element === op) {
                const expr = new Expression();
                expr.items = [newItems.pop(), element, this.items[ix + 1]];
                newItems.push(expr);

                ix++;
            } else {
                newItems.push(element);
            }
        }
        this.items = newItems;
    }

    evalSubExpressions() {
        for (let ix = 0; ix < this.items.length; ix++) {
            const element = this.items[ix];
            if (element instanceof Expression) {
                this.items[ix] = element.eval();
            }
        }
    }

    eval() {
        this.evalSubExpressions();

        let currValue = this.items[0];
        for (let ix = 1; ix < this.items.length;) {
            switch (this.items[ix]) {
                case '+':
                    currValue += this.items[ix + 1]
                    break;
                case '*':
                    currValue *= this.items[ix + 1]
                    break;
                default:
                    break;
            }
            ix += 2;
        }
        return currValue;
    }
}

const _parseSingleExpr = (restItems) => {
    if (!restItems.length) {
        throw Error("Started new expr without items");
    }

    const expr = new Expression();

    while (restItems.length) {
        let currentItem = restItems.shift();
        if (!isNaN(Number(currentItem))) {
            expr.items.push(Number(currentItem))
        } else if (currentItem.charAt(0) === '(') {
            currentItem = currentItem.substr(1);
            restItems.unshift(currentItem);

            const { expr: subExpr, closings } = _parseSingleExpr(restItems);
            expr.items.push(subExpr);
            if (closings) {
                return {
                    expr,
                    closings: closings - 1
                }
            }

        } else if (currentItem.charAt(currentItem.length - 1) === ')') {
            const closings = currentItem.match(/\)/g).length;

            currentItem = Number(currentItem.substr(0, currentItem.length - closings));
            expr.items.push(currentItem)
            return {
                expr,
                closings: closings - 1
            }
        } else {
            expr.items.push(currentItem)
        }
    }

    return {
        expr,
        closings: 0
    };
}

const parseExpr = (line) => {
    const items = line.split(" ");

    return _parseSingleExpr(items).expr
}

const run = async () => {
    const exprs = (await readFileLines(inputPath)).map(parseExpr)

    const results = exprs.map(expr => expr.eval());

    console.log(sumArr(results));
}




// run();

// ------------------------------- Part 2 -------------------------------

const run2 = async () => {
    const exprs = (await readFileLines(inputPath))
        .map(parseExpr)

    exprs.forEach(expr => expr.increasePrio("+"));

    const results = exprs.map(expr => expr.eval());

    console.log(sumArr(results));
}



run2();