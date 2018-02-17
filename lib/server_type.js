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
 * @param {*} callback Callback with the ServerType result
 */
ServerType.getSSHKeyById = (id, callback) => {
    request.get(paths.translate(paths.serverTypes_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new ServerType(result.result.server_type));
            }
        }
    });
};

/**
 * Gets all server type objects.
 * @param {*} callback Return list with all ServerTypes
 * @param {*} name Can be used to filter server types by their name. The response will only contain the server type matching the specified name.
 */
ServerType.getAllServerTypes = (callback, name) => {
    let path = paths.translate(paths.serverTypes_all);
    if (name) {
        path += '?name=' + name;
    }
    request.get(path, (result) => {
        let serverTypes = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.server_types.length; i += 1) {
                    serverTypes.push(new ServerType(result.result.server_types[i]));
                }
                callback(undefined, serverTypes);
            }
        }
    });
};
