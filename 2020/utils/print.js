const progress = (current, total) => {
    console.log(`${current}/${total} - ${(100 / total) * current} %`);
}

module.exports = {
    progress
}