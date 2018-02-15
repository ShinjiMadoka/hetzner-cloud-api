const request = require('./request');
const paths = require('./paths');

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
 * @param {*} callback Callback with the location result
 */
Location.getLocationById = (id, callback) => {
    request.get(paths.translate(paths.location_id, id), (result) => {
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            callback(new Location(result.result.location));
        }
    });
};

/**
 * Gets all location objects.
 * @param {*} callback Return list with all locations
 * @param {*} name Can be used to filter locations by their name. The response will only contain the location matching the specified name.
 */
Location.getAllLocations = (callback, name) => {
    let path = paths.translate(paths.location_all);
    if (name) {
        path += '?name=' + name;
    }
    request.get(path, (result) => {
        let locations = [];
        let i;
        if (result.err && result.status >= 300) {
            throw new Error(result.status);
        }
        if (result.result && callback) {
            for (i = 0; i < result.result.locations.length; i += 1) {
                locations.push(new Location(result.result.locations[i]));
            }
            callback(locations);
        }
    });
};
