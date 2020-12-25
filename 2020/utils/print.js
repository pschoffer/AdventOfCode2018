const progress = (current, total) => {
    if (current % (total / 1000) === 0) {
        console.log(`${current}/${total} - ${(100 / total) * current} %`);
    }
}

const perfTime = async (callback, label) => {
    console.time(label);

    await callback();

    console.timeEnd(label);
}

module.exports = {
    progress,
    perfTime
}