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
 * @param {*} callback The result of the request
 * @param {string} status 'running', 'success', 'error'
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
Server.prototype.getActions = function (callback, status, sort) {
    let path = paths.translate(paths.server_actions, this._id);
    if (status) {
        path += '?status=' + status;
    }
    if (sort) {
        path += path.contains('?') ? '&' : '?';
        path += 'sort=' + sort;
    }
    request.get(path, (result) => {
        let actions = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.actions.length; i += 1) {
                    actions.push(new Action(result.result.actions[i]));
                }
                callback(undefined, actions);
            }
        }
    });
};

/**
 * Returns a specific action object for a Server.
 * @param {*} actionId ID of the action
 * @param {*} callback The result of the actionId
 */
Server.prototype.getAction = function (actionId, callback) {
    request.get(paths.translate(paths.server_action_id, this._id, actionId), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Action(result.result.action));
            }
        }
    });
};

/**
 * Power-On the server
 * @param {*} callback Result or throws an error
 */
Server.prototype.powerOn = function(callback) {
    request.post(paths.translate(paths.server_power_on, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Power-Of the server (power cut)
 * @param {*} callback Result or throws an error
 */
Server.prototype.powerOff = function(callback) {
    request.post(paths.translate(paths.server_power_off, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Reboot the server as ResetButton (ACPI)
 * @param {*} callback Result or throws an error
 */
Server.prototype.softReboot = function(callback) {
    request.post(paths.translate(paths.server_soft_reboot, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Cut the power of the server and start it again
 * @param {*} callback Result or throws an error
 */
Server.prototype.reset = function(callback) {
    request.post(paths.translate(paths.server_reset, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Shutdown the server by sending a ACPI signal
 * @param {*} callback Result or throws an error
 */
Server.prototype.shutdown = function(callback) {
    request.post(paths.translate(paths.server_shutdown, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
        
    });
};

/**
 * Reset the root password, if server Linux is installed and quemu guest agent is running
 * @param {*} callback Return the new root password
 */
Server.prototype.resetRootPassword = function(callback) {
    request.post(paths.translate(paths.server_reset_root_password, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, result.result['root_password']);
        }
    });
};

/**
 * Load the config new from the API
 * @param {*} callback Returns the refreshed server
 */

Server.prototype.reloadConfig = function(callback) {
    Server.getServerById(this._id, (error, result) => {
        if (!error) {
            this._options = result.getInformation();
            callback(undefined, this);
        } else {
            callback(error, this);
        }
    });
};


/**
 * Don't use it! Changes the name of the server
 * @param {string} newName The new name
 * @param {*} callback Result with the new config of the server
 */
Server.prototype.changeName = function(newName, callback) {
    let put = {
        name: newName,
    };
    request.put(paths.translate(paths.server_id, this._id), JSON.stringify(put), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            this._options = result.result.server;
            callback(undefined, this);
        }
    });
};

/**
 * Delete the server from the cloud
 * @param {*} callback Return the success result from the API
 */
Server.prototype.delete = function(callback) {
    request.delete(paths.translate(paths.server_id, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, this._options);
        }
        
    });
};

/**
 * Enables the rescuemode with params
 * @param {*} callback The result of activating the mode (root password)
 * @param {*} sshKeys The given SSH Keys for the small linux
 */
Server.prototype.enableRescueMode = function(callback, sshKeys) {
    let put = {};
    if (sshKeys) {
        put.ssh_keys = sshKeys;
    }
    request.post(paths.translate(paths.server_enable_rescue, this._id), JSON.stringify(put), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, result.result['root_password']);
        }
        
    });
};

/**
 * Disable the rescue mode
 * @param {*} callback The result of the request
 */
Server.prototype.disableRescueMode = function(callback) {
    request.post(paths.translate(paths.server_disable_rescue, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Creates an image of the server
 * @param {*} callback Returns the created image
 * @param {string} description The description of the image
 * @param {string} type The type of the image (snapshot, image)
 */
Server.prototype.createImage = function(callback, description, type) {
    let put = {};
    if (description) {
        put.description = description;
    }
    if (type) {
        put.type = type;
    }
    request.post(paths.translate(paths.server_create_image, this._id), JSON.stringify(put), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Image(result.result.image));
        }
    });
};

/**
 * Rebuild a server with the given image
 * @param {*} callback Return the result of rebuild
 * @param {string} image The given image to use
 */
Server.prototype.rebuildFromImage = function(callback, image) {
    let body = {
        image: image,
    };
    request.post(paths.translate(paths.server_rebuild_image, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Upgrade or Downgrade a server
 * @param {string} type The new server type
 * @param {*} callback The result of changing
 * @param {boolean} upgradeDisk If false, it is possible to downgrade the server
 */
Server.prototype.changeType = function(type, callback, upgradeDisk) {
    let body = {
        server_type: type,
    };
    if (upgradeDisk) {
        body.upgrade_disk = upgradeDisk;
    }
    request.post(paths.translate(paths.server_change_type, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Enable the daily backup
 * @param {*} callback The result of the backup configuration
 * @param {*} backupWindow The backup time window (Choices UTC: 22-02 02-06 06-10 10-14 14-18 18-22)
 */
Server.prototype.enableBackup = function(callback, backupWindow) {
    let body = {};
    if (backupWindow) {
        body.backup_window = backupWindow;
    }
    request.post(paths.translate(paths.server_enable_backup, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result));
        }
    });
};

/**
 * Disable the backup for the given server
 * @param {*} callback The result of disabling backup
 */
Server.prototype.disableBackup = function(callback) {
    request.post(paths.translate(paths.server_disable_backup, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(new Action(result.result));
        }
    });
};

/**
 * Attach an ISO to the server, which is used by the next boot
 * @param {*} iso The ISO to use (name or ID) (ISO.getAllISOs)
 * @param {*} callback The result of attaching the ISO
 */
Server.prototype.attachISO = function(iso, callback) {
    let body = {
        iso: iso,
    };
    request.post(paths.translate(paths.server_attach_iso, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result));
        }
    });
};

/**
 * Dettach an attached ISO
 * @param {*} callback The result of deattaching the ISO
 */
Server.prototype.deattachISO = function(callback) {
    request.post(paths.translate(paths.server_deattach_iso, this._id), '', (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result));
        }
    });
};

/**
 * Changes the hostname that will appear when getting the hostname belonging to the primary IPs (ipv4 and ipv6) of this server.
 * @param {string} ip Primary IP address for which the reverse DNS entry should be set.
 * @param {string} dnsPTR Hostname to set as a reverse DNS PTR entry. Will reset to original value if null
 * @param {*} callback The result of changing the reverse DNS
 */
Server.prototype.changeReverseDNS = function(ip, dnsPTR, callback) {
    let body = {
        ip: ip,
        dns_ptr : dnsPTR,
    };
    request.post(paths.translate(paths.server_reverse_dns, this._id), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            callback(undefined, new Action(result.result.action));
        }
    });
};

/**
 * Global Functions without "Instance"
 */

/**
 * Returns all Server from the token (project)
 * @param {*} callback Callback(result => [Server, ...])
 */
Server.getAllServer = (callback) => {
    request.get(paths.translate(paths.server_all), (result) => {
        let servers = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.servers.length; i += 1) {
                    servers.push(new Server(result.result.servers[i]));
                }
                callback(undefined, servers);
            }
        }
    });
};

/**
 * Returns the server with the given ID or throws an error
 * @param {number} id ID Server
 * @param {*} callback Callback with the Server result
 */
Server.getServerById = (id, callback) => {
    request.get(paths.translate(paths.server_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Server(result.result.server));
            }
        }
    });
};

/**
 * Creates a new server in the given project
 * @param {string} name The name of the server
 * @param {string} serverType Possible types: cx11,cx21,x31,cx41,cx51
 * @param {string} image ID or name of the image the server is created from
 * @param {*} callback Result the created server
 * @param {string} datacenter ID or name of datacenter to create server in
 * @param {string} location ID or name of location to create server in
 * @param {bool} startAfterCreate Start Server right after creation. Defaults to true

 * @param {array} sshKeys SSH key IDs which should be injected into the server at creation time
 * @param {string} userData Cloud-Init user data to use during server creation
 */
Server.createServer = (name, serverType, image, callback, sshKeys, startAfterCreate, datacenter, location, userData) => {
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
    request.post(paths.translate(paths.server_all), JSON.stringify(requestBody), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Server(result.result.server));
            }
        }
    });
};
