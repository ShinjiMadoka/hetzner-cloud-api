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
 */
SSHKey.prototype.changeName = function(newName) {
    return new Promise(async (resolve, reject) => {
        let put = {
            name: newName,
        };
        let result = await request.put(paths.translate(paths.sshKey_id, this._id), JSON.stringify(put));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            this._options = result.result.ssh_key;
            resolve(this);
        }
    });
};

/**
 * Deletes a SSH key. It cannot be used anymore.
 */
SSHKey.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.delete(paths.translate(paths.sshKey_id, this._id), '');
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
 * Returns a specific ssh key object.
 * @param {*} id ID of the SSH key
 */
SSHKey.getSSHKeyById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.sshKey_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new SSHKey(result.result.ssh_key));
            }
        }
    });
};

/**
 * Returns all ssh key objects.
 * @param {string} name Can be used to filter ssh keys by their name. The response will only contain the ssh key matching the specified name.
 */
SSHKey.getAllSSHKeys = (name) => {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.sshKey_all);
        if (name) {
            path += '?name=' + name;
        }
        let result = await request.get(path);
        let sshKeys = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.ssh_keys.length; i += 1) {
                    sshKeys.push(new SSHKey(result.result.ssh_keys[i]));
                }
                resolve(sshKeys);
            }
        }
    });
};

/**
 * Creates a new SSH Key
 * @param {string} name Name of the SSH key
 * @param {string} publicKey Public key
 */
SSHKey.createSSHKey = (name, publicKey) => {
    return new Promise(async (resolve, reject) => {
        let requestBody = {
            name: name,
            public_key: publicKey,
        };
        let result = await request.post(paths.translate(paths.sshKey_all), JSON.stringify(requestBody));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new SSHKey(result.result.ssh_key));
            }
        }
    });
};
