const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = Location;

/**
 * Instance of a ServerTypes Object with interactions
 * @param {*} options Config from the SSHKey
 */
function Location(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Gets a specific location object.
 * @param {number} id ID of location
 */
Location.getLocationById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.location_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Location(result.result.location));
            }
        }
    });
};

/**
 * Gets all location objects.
 * @param {*} name Can be used to filter locations by their name. The response will only contain the location matching the specified name.
 */
Location.getAllLocations = (name) => {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.location_all);
        if (name) {
            path += '?name=' + name;
        }
        let result = await request.get(path);
        let locations = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.locations.length; i += 1) {
                    locations.push(new Location(result.result.locations[i]));
                }
                resolve(locations);
            }
        }
    });
};
