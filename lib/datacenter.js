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
 */
Datacenter.getDatacenterById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.datacenter_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Datacenter(result.result.datacenter));
            }
        }
    });
};

/**
 * Gets all Datacenter objects.
 * @param {*} name Can be used to filter Datacenter by their name. The response will only contain the Datacenter matching the specified name.
 */
Datacenter.getAllDatacenters = (name) => {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.datacenter_all);
        if (name) {
            path += '?name=' + name;
        }
        let result = await request.get(path);
        let datacenters = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.datacenters.length; i += 1) {
                    datacenters.push(new Datacenter(result.result.datacenters[i]));
                }
                resolve(datacenters);
            }
        }
    });
};
