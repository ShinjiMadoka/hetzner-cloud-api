const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = Image;

/**
 * Instance of a Image Object with interactions
 * @param {*} options Config from the image
 */
function Image(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns the image object as reference
 * @return {object} Imageobject
 */
Image.prototype.getInformation = function() {
    return this._options;
};

/**
 * Returns the id of an image
 * @return {number} The ID
 */
Image.prototype.getId = function() {
    return this._id;
};

/**
 * Update an image with information
 * @param {*} description Set the new description
 * @param {*} type Set the new type (snapshot)
 */
Image.prototype.update = function(description, type) {
    return new Promise(async (resolve, reject) => {
        let body = {};
        if (description) {
            body.description = description;
        }
        if (type) {
            body.type = type;
        }
        let result = await request.post(paths.translate(paths.image_id, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            this._options = result.result.image;
            resolve(this);
        }
    });
};

/**
 * Delete the image
 */
Image.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.delete(paths.translate(paths.image_id, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(true);
        }
    });
};


/**
 * Get all images from the token
 */
Image.getAllImages = () => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.image_all));
        let images = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.images.length; i += 1) {
                    images.push(new Image(result.result.images[i]));
                }
                resolve(images);
            }
        }
    });
};

/**
 * Returns the image with the given ID or throws an error
 * @param {number} id ID Image
 */
Image.getImage = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.image_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Image(result.result.image));
            }
        }
    });
};
