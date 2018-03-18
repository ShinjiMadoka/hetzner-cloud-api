const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = ServerType;

/**
 * Instance of a ServerTypes Object with interactions
 * @param {*} options Config from the SSHKey
 */
function ServerType(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Gets a specific server type object.
 * @param {number} id ID of server type
 */
ServerType.getServerTypeById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.serverTypes_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new ServerType(result.result.server_type));
            }
        }
    });
};

/**
 * Gets all server type objects.
 * @param {*} name Can be used to filter server types by their name. The response will only contain the server type matching the specified name.
 */
ServerType.getAllServerTypes = (name) => {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.serverTypes_all);
        if (name) {
            path += '?name=' + name;
        }
        let result = await request.get(path);
        let serverTypes = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.server_types.length; i += 1) {
                    serverTypes.push(new ServerType(result.result.server_types[i]));
                }
                resolve(serverTypes);
            }
        }
    });
};
