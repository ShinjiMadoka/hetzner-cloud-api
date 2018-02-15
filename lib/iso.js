const request = require('./request');
const paths = require('./paths');

module.exports = ISO;

/**
 * Instance of a ISO Object with interactions
 * @param {*} options Config from the image
 */
function ISO(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns the iso object as reference
 * @return {object} IsoObject
 */
ISO.prototype.getInformation = function() {
    return this._options;
};

/**
 * Returns the id of an image
 * @return {number} The ID
 */
ISO.prototype.getId = function() {
    return this._id;
};

/**
 * Get all images from the token
 * @param {*} callback Return list with all isos
 */
ISO.getAllIsos = (callback) => {
    request.get(paths.translate(paths.iso_all), (result) => {
        let isos = [];
        let i;
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            for (i = 0; i < result.result.isos.length; i += 1) {
                isos.push(new ISO(result.result.isos[i]));
            }
            callback(isos);
        }
    });
};

/**
 * Returns the iso with the given ID or throws an error
 * @param {number} id ID ISO
 * @param {*} callback Callback with the ISO result
 */
ISO.getIso = (id, callback) => {
    request.get(paths.translate(paths.iso_id, id), (result) => {
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            callback(new ISO(result.result.iso));
        }
    });
};
