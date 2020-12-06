const mul = (a, b) => {
    return a * b;
}

const add = (a, b) => {
    return a + b;
}

const sumArr = (arr) => {
    return arr.reduce(add, 0);
}

const mulArr = (arr) => {
    return arr.reduce(mul, 1);
}


module.exports = {
    mul,
    add,
    sumArr,
    mulArr
}