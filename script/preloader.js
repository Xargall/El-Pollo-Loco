/**
 * Collects all image paths from IMAGES_* properties of the given objects.
 * @param {Object[]} objects
 * @returns {string[]}
 */
function collectImagePaths(objects) {
    const paths = new Set();
    objects.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (key.startsWith('IMAGES_') && Array.isArray(obj[key])) {
                obj[key].forEach(p => paths.add(p));
            }
        });
    });
    return [...paths];
}

/**
 * Preloads all images and returns a Promise that resolves when done.
 * Updates the loading bar fill element during loading.
 * @param {string[]} paths
 * @param {HTMLElement} fillEl
 * @returns {Promise<void>}
 */
function preloadImages(paths, fillEl) {
    let loaded = 0;
    const total = paths.length;
    return Promise.all(paths.map(path => new Promise(resolve => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loaded++;
            fillEl.style.width = `${Math.round((loaded / total) * 100)}%`;
            fillEl.parentElement.setAttribute('aria-valuenow', Math.round((loaded / total) * 100));
            resolve();
        };
        img.src = path;
    })));
}