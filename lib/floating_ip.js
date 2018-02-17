const request = require('./request');
const paths = require('./paths');
const Action = require('./action');
const HError = require('./herror');

module.exports = FloatingIP;

/**
 * Instance of a FloatingIP Object with interactions
 * @param {object} options The floating IP informations
 */
function FloatingIP(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns the foatingIP object as reference
 * @return {object} FloatingIPObject
 */
FloatingIP.prototype.getInformation = function() {
    return this._options;
};

/**
 * Changes the desciption
 * @param {*} newName The new description
 * @param {*} callback The changed floatingIP
 */
FloatingIP.prototype.changeDescription = function(newName, callback) {
    let put = {
        name: newName,
    };
    request.put(paths.translate(paths.floatIP_id, this._id), JSON.stringify(put), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            this._options = result.result.floating_ip;
            callback(undefined, this._options);
        }
    });
};

/**
 * Delete the floating IP
 * @param {*} callback Result if it is deleted
 */
FloatingIP.prototype.delete = function(callback) {
    request.delete(paths.translate(paths.floatIP_id, this._id), '', (result) => {
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
 * Returns all actions for the given FloatingIP
 * @param {*} callback Result with the Actions
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
FloatingIP.prototype.getAllActions = function (callback, sort) {
    let path = paths.translate(paths.floatIP_actions, this._id);
    if (sort) {
        path += '?sort=' + sort;
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
 * Return an action for a floating IP
 * @param {number} actionId The ActionID
 * @param {Action} callback The action Object if found
 */
FloatingIP.prototype.getActionById = function (actionId, callback) {
    request.get(paths.translate(paths.floatIP_action_id, this._id, actionId), (result) => {
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
 * Assigns a Floating IP to a server.
 * @param {number} serverId ID of the server the Floating IP shall be assigned to
 * @param {Action} callback The action object
 */
FloatingIP.prototype.assignToServer = function (serverId, callback) {
    let body = {
        server : serverId,
    };
    request.post(paths.translate(paths.floatIP_assign, this._id), JSON.stringify(body), (result) => {
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
 * Unassigns a Floating IP, resulting in it being unreachable. You may assign it to a server again at a later time.
 * @param {Action} callback The action object
 */
FloatingIP.prototype.unassignToServer = function (callback) {
    request.post(paths.translate(paths.floatIP_unassign, this._id), '', (result) => {
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
 * Changes the hostname that will appear when getting the hostname belonging to this Floating IP.
 * @param {string} ip IP address for which to set the reverse DNS entry
 * @param {string,null} dnsPTR Hostname to set as a reverse DNS PTR entry, will reset to original default value if null
 * @param {*} callback The action of changing the reverse DNS
 */
FloatingIP.prototype.changeReverseDNS = function(ip, dnsPTR, callback) {
    let body = {
        ip: ip,
        dns_ptr : dnsPTR,
    };
    request.post(paths.translate(paths.floatIP_reverse_dns, this._id), JSON.stringify(body), (result) => {
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
 * Request all Floating IPs
 * @param {array(FloatingIP)} callback Result with a list of FloatingIP
 */
FloatingIP.getAllFloatingIps = (callback) => {
    request.get(paths.translate(paths.floatIP_all), (result) => {
        let floatingIps = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                for (i = 0; i < result.result.floating_ips.length; i += 1) {
                    floatingIps.push(new FloatingIP(result.result.floating_ips[i]));
                }
                callback(undefined, floatingIps);
            }
        }
    });
};

/**
 * Request a specific Floating IP
 * @param {number} id The id of the Floating IP
 * @param {*} callback The FloatingIP if it was found
 */
FloatingIP.getFloatingIpById = (id, callback) => {
    request.get(paths.translate(paths.floatIP_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new FloatingIP(result.result.floating_ip));
            }
        }
    });
};

/**
 * Create a new Floating IP
 * @param {string} type The type ('ipv4', 'ipv6')
 * @param {*} callback The created FloatingIP
 * @param {string} home_location Home location
 * @param {string} server Server to assign the Floating IP to
 * @param {string} description The description
 */
FloatingIP.createFloatingIp = (type, callback, home_location, server, description) => {
    let body = {
        type : type,
    };
    if (home_location) {
        body.home_location = home_location;
    }
    if (server) {
        body.server = server;
    }
    if (description) {
        body.description = description;
    }
    request.post(paths.translate(paths.floatIP_all), JSON.stringify(body), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new FloatingIP(result.result.floating_ip));
            }
        }
    });
};
