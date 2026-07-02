let allIntervalIds = [];

function trackedSetInterval(fn, delay) {
    let id = setInterval(fn, delay);
    allIntervalIds.push(id);
    return id;
}

function clearAllIntervals() {
    console.log('clearing', allIntervalIds.length, 'intervals:', allIntervalIds);
    allIntervalIds.forEach(id => clearInterval(id));
    allIntervalIds = [];
}