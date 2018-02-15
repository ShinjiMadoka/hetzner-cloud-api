const request = require('./request');
const paths = require('./paths');

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
 * @param {*} callback Returns the changed image
 * @param {*} description Set the new description
 * @param {*} type Set the new type (snapshot)
 */
Image.prototype.update = function(callback, description, type) {
    let body = {};
    if (description) {
        body.description = description;
    }
    if (type) {
        body.type = type;
    }
    request.post(paths.translate(paths.image_id, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        this._options = result.result.image;
        callback(this);
    });
};

/**
 * Delete the image
 * @param {*} callback True if the image was deleted or throws an error
 */
Image.prototype.delete = function(callback) {
    request.delete(paths.translate(paths.image_id, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        callback(true);
    });
};


/**
 * Get all images from the token
 * @param {*} callback Return list with all images
 */
Image.getAllImages = (callback) => {
    request.get(paths.translate(paths.image_all), (result) => {
        let images = [];
        let i;
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            for (i = 0; i < result.result.images.length; i += 1) {
                images.push(new Image(result.result.images[i]));
            }
            callback(images);
        }
    });
};

/**
 * Returns the image with the given ID or throws an error
 * @param {number} id ID Image
 * @param {*} callback Callback with the Image result
 */
Image.getImage = (id, callback) => {
    request.get(paths.translate(paths.image_id, id), (result) => {
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            callback(new Image(result.result.image));
        }
    });
};
