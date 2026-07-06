/** @type {number[]} Registry of all active interval IDs created via trackedSetInterval. */
let allIntervalIds = [];

/**
 * Creates a tracked setInterval that registers the interval ID globally.
 * Allows all intervals to be cleared at once via clearAllIntervals().
 *
 * @param {Function} fn - The callback function to execute on each interval.
 * @param {number} delay - The interval delay in milliseconds.
 * @returns {number} The interval ID.
 */
function trackedSetInterval(fn, delay) {
    let id = setInterval(fn, delay);
    allIntervalIds.push(id);
    return id;
}

/**
 * Clears all intervals registered via trackedSetInterval and resets the registry.
 */
function clearAllIntervals() {
    console.log('clearing', allIntervalIds.length, 'intervals:', allIntervalIds);
    allIntervalIds.forEach(id => clearInterval(id));
    allIntervalIds = [];
}