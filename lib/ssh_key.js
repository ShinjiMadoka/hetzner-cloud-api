const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = SSHKey;

/**
 * Instance of a SSHKey Object with interactions
 * @param {*} options Config from the SSHKey
 */
function SSHKey(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Changes the name of a ssh key.
 * @param {string} newName New name Name to set
 * @param {*} callback Result with the SSHKey Instance of the server
 */
SSHKey.prototype.changeName = function(newName, callback) {
    let put = {
        name: newName,
    };
    request.put(paths.translate(paths.sshKey_id, this._id), JSON.stringify(put), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            this._options = result.result.ssh_key;
            callback(undefined, this);
        }
    });
};

/**
 * Deletes a SSH key. It cannot be used anymore.
 * @param {*} callback True if the SSH Key was deleted or throws an error
 */
SSHKey.prototype.delete = function(callback) {
    request.delete(paths.translate(paths.sshKey_id, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, true);
        }
    });
};

/**
 * Returns a specific ssh key object.
 * @param {*} id ID of the SSH key
 * @param {*} callback Callback with the SSH Key result
 */
SSHKey.getSSHKeyById = (id, callback) => {
    request.get(paths.translate(paths.sshKey_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new SSHKey(result.result.ssh_key));
            }
        }
    });
};

/**
 * Returns all ssh key objects.
 * @param {*} callback Return list with all SSH Keys
 * @param {string} name Can be used to filter ssh keys by their name. The response will only contain the ssh key matching the specified name.
 */
SSHKey.getAllSSHKeys = (callback, name) => {
    let path = paths.translate(paths.sshKey_all);
    if (name) {
        path += '?name=' + name;
    }
    request.get(path, (result) => {
        let sshKeys = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.ssh_keys.length; i += 1) {
                    sshKeys.push(new SSHKey(result.result.ssh_keys[i]));
                }
                callback(undefined, sshKeys);
            }
        }
    });
};

/**
 * Creates a new SSH Key
 * @param {string} name Name of the SSH key
 * @param {string} publicKey Public key
 * @param {SSHKey} callback The created SSH as callback
 */
SSHKey.createSSHKey = (name, publicKey, callback) => {
    let requestBody = {
        name: name,
        public_key: publicKey,
    };
    request.post(paths.translate(paths.sshKey_all), JSON.stringify(requestBody), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new SSHKey(result.result.ssh_key));
            }
        }
    });
};
