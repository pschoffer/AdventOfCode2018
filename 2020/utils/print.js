const progress = (current, total) => {
    console.log(`${current}/${total} - ${(100 / total) * current} %`);
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