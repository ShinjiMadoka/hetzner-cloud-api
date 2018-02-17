const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = Datacenter;

/**
 * Instance of a Datacenter Object with interactions
 * @param {*} options Config from the Datacenter
 */
function Datacenter(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Gets a specific Datacenter object.
 * @param {number} id ID of Datacenter
 * @param {*} callback Callback with the Datacenter result
 */
Datacenter.getDatacenterById = (id, callback) => {
    request.get(paths.translate(paths.datacenter_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Datacenter(result.result.datacenter));
            }
        }
    });
};

/**
 * Gets all Datacenter objects.
 * @param {*} callback Return list with all Datacenter
 * @param {*} name Can be used to filter Datacenter by their name. The response will only contain the Datacenter matching the specified name.
 */
Datacenter.getAllDatacenters = (callback, name) => {
    let path = paths.translate(paths.datacenter_all);
    if (name) {
        path += '?name=' + name;
    }
    request.get(path, (result) => {
        let datacenters = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.datacenters.length; i += 1) {
                    datacenters.push(new Datacenter(result.result.datacenters[i]));
                }
                callback(undefined, datacenters);
            }
        }
    });
};
