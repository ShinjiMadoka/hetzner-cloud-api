const request = require('./request');
const paths = require('./paths');
const Image = require('./image');
const Action = require('./action');
const HError = require('./herror');

module.exports = Server;

/**
 * Instance of a Server Object with interactions
 * @param {object} options The server informations
 */
function Server(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns the server object as reference
 * @return {object} Serverobject
 */
Server.prototype.getInformation = function() {
    return this._options;
};

/**
 * Return all actions of an Server
 * @param {string} status 'running', 'success', 'error'
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
Server.prototype.getActions = function (status, sort) {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.server_actions, this._id);
        if (status) {
            path += '?status=' + status;
        }
        if (sort) {
            path += path.contains('?') ? '&' : '?';
            path += 'sort=' + sort;
        }
        let result = await request.get(path);
        let actions = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.actions.length; i += 1) {
                    actions.push(new Action(result.result.actions[i]));
                }
                resolve(actions);
            }
        }
    });
};

/**
 * Returns a specific action object for a Server.
 * @param {*} actionId ID of the action
 */
Server.prototype.getAction = function (actionId) {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.server_action_id, this._id, actionId));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Action(result.result.action));
            }
        }
    });
};

/**
 * Power-On the server
 */
Server.prototype.powerOn = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_power_on, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Power-Of the server (power cut)
 */
Server.prototype.powerOff = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_power_off, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Reboot the server as ResetButton (ACPI)
 */
Server.prototype.softReboot = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_soft_reboot, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Cut the power of the server and start it again
 */
Server.prototype.reset = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_reset, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Shutdown the server by sending a ACPI signal
 */
Server.prototype.shutdown = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_shutdown, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Reset the root password, if server Linux is installed and quemu guest agent is running
 */
Server.prototype.resetRootPassword = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_reset_root_password, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(result.result['root_password']);
        }
    });
};

/**
 * Load the config new from the API
 * @param {*} callback Returns the refreshed server
 */
Server.prototype.reloadConfig = function(callback) {
    return new Promise(async (resolve, reject) => {
        Server.getServerById(this._id).then((result) => {
            this._options = result.getInformation();
            resolve(this)
        }).catch((error) => {
            reject(this)
        });
    });
};

/**
 * Don't use it! Changes the name of the server
 * @param {string} newName The new name
 */
Server.prototype.changeName = function(newName) {
    return new Promise(async (resolve, reject) => {
        let put = {
            name: newName,
        };
        let result = await request.put(paths.translate(paths.server_id, this._id), JSON.stringify(put));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            this._options = result.result.server;
            resolve(this);
        }
    });
};

/**
 * Delete the server from the cloud
 */
Server.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.delete(paths.translate(paths.server_id, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(this._options);
        }
    });
};

/**
 * Enables the rescuemode with params
 * @param {*} sshKeys The given SSH Keys for the small linux
 */
Server.prototype.enableRescueMode = function(sshKeys) {
    return new Promise(async (resolve, reject) => {
        let put = {};
        if (sshKeys) {
            put.ssh_keys = sshKeys;
        }
        let result = await request.post(paths.translate(paths.server_enable_rescue, this._id), JSON.stringify(put));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(result.result['root_password']);
        }
    });
};

/**
 * Disable the rescue mode
 */
Server.prototype.disableRescueMode = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_disable_rescue, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Creates an image of the server
 * @param {string} description The description of the image
 * @param {string} type The type of the image (snapshot, image)
 */
Server.prototype.createImage = function(description, type) {
    return new Promise(async (resolve, reject) => {
        let put = {};
        if (description) {
            put.description = description;
        }
        if (type) {
            put.type = type;
        }
        let result = await request.post(paths.translate(paths.server_create_image, this._id), JSON.stringify(put));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Image(result.result.image));
        }
    });
};

/**
 * Rebuild a server with the given image
 * @param {string} image The given image to use
 */
Server.prototype.rebuildFromImage = function(image) {
    return new Promise(async (resolve, reject) => {
        let body = {
            image: image,
        };
        let result = await request.post(paths.translate(paths.server_rebuild_image, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Upgrade or Downgrade a server
 * @param {string} type The new server type
 * @param {boolean} upgradeDisk If false, it is possible to downgrade the server
 */
Server.prototype.changeType = function(type, upgradeDisk) {
    return new Promise(async (resolve, reject) => {
        let body = {
            server_type: type,
        };
        if (upgradeDisk) {
            body.upgrade_disk = upgradeDisk;
        }
        let result = await request.post(paths.translate(paths.server_change_type, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Enable the daily backup
 * @param {*} backupWindow The backup time window (Choices UTC: 22-02 02-06 06-10 10-14 14-18 18-22)
 */
Server.prototype.enableBackup = function(backupWindow) {
    return new Promise(async (resolve, reject) => {
        let body = {};
        if (backupWindow) {
            body.backup_window = backupWindow;
        }
        let result = await request.post(paths.translate(paths.server_enable_backup, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result));
        }
    });
};

/**
 * Disable the backup for the given server
 */
Server.prototype.disableBackup = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_disable_backup, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result));
        }
    });
};

/**
 * Attach an ISO to the server, which is used by the next boot
 * @param {*} iso The ISO to use (name or ID) (ISO.getAllISOs)
 */
Server.prototype.attachISO = function(iso) {
    return new Promise(async (resolve, reject) => {
        let body = {
            iso: iso,
        };
        let result = await request.post(paths.translate(paths.server_attach_iso, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result));
        }
    });
};

/**
 * Dettach an attached ISO
 */
Server.prototype.deattachISO = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.server_deattach_iso, this._id), '');
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result));
        }
    });
};

/**
 * Changes the hostname that will appear when getting the hostname belonging to the primary IPs (ipv4 and ipv6) of this server.
 * @param {string} ip Primary IP address for which the reverse DNS entry should be set.
 * @param {string} dnsPTR Hostname to set as a reverse DNS PTR entry. Will reset to original value if null
 */
Server.prototype.changeReverseDNS = function(ip, dnsPTR) {
    return new Promise(async (resolve, reject) => {
        let body = {
            ip: ip,
            dns_ptr : dnsPTR,
        };
        let result = await request.post(paths.translate(paths.server_reverse_dns, this._id), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            resolve(new Action(result.result.action));
        }
    });
};

/**
 * Global Functions without "Instance"
 */

/**
 * Returns all Server from the token (project)
 */
Server.getAllServer = () => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.server_all));
        let servers = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.resul) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.servers.length; i += 1) {
                    servers.push(new Server(result.result.servers[i]));
                }
                resolve(servers);
            }
        }
    });
};

/**
 * Returns the server with the given ID or throws an error
 * @param {number} id ID Server
 */
Server.getServerById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.server_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Server(result.result.server));
            }
        }
    });
};

/**
 * Creates a new server in the given project
 * @param {string} name The name of the server
 * @param {string} serverType Possible types: cx11,cx21,x31,cx41,cx51
 * @param {string} image ID or name of the image the server is created from
 * @param {string} datacenter ID or name of datacenter to create server in
 * @param {string} location ID or name of location to create server in
 * @param {bool} startAfterCreate Start Server right after creation. Defaults to true

 * @param {array} sshKeys SSH key IDs which should be injected into the server at creation time
 * @param {string} userData Cloud-Init user data to use during server creation
 */
Server.createServer = (name, serverType, image, sshKeys, startAfterCreate, datacenter, location, userData) => {
    return new Promise(async (resolve, reject) => {
        let requestBody = {
            name: name,
            server_type: serverType,
        };
        if (datacenter) {
            requestBody.datacenter = datacenter;
        }
        if (location) {
            requestBody.location = location;
        }
        if (startAfterCreate) {
            requestBody.start_after_create = startAfterCreate;
        }
        if (image) {
            requestBody.image = image;
        }
        if (sshKeys) {
            requestBody.ssh_keys = sshKeys;
        }
        if (userData) {
            requestBody.user_data = userData;
        }
        let result = await request.post(paths.translate(paths.server_all), JSON.stringify(requestBody));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Server(result.result.server));
            }
        }
    });
};
