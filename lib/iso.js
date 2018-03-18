const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

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
 */
ISO.getAllIsos = () => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.iso_all));
        let isos = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.isos.length; i += 1) {
                    isos.push(new ISO(result.result.isos[i]));
                }
                resolve(isos);
            }
        }
    });
};

/**
 * Returns the iso with the given ID or throws an error
 * @param {number} id ID ISO
 */
ISO.getIso = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.iso_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new ISO(result.result.iso));
            }
        }
    });
};
