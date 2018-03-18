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
 */
FloatingIP.prototype.changeDescription = function(newName) {
    return new Promise(async (resolve, reject) => {
        let put = {
            name: newName,
        };
        let result = await request.put(paths.translate(paths.floatIP_id, this._id), JSON.stringify(put));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            this._options = result.result.floating_ip;
            resolve(this._options);
        }
    });
};

/**
 * Delete the floating IP
 */
FloatingIP.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        let result = await request.delete(paths.translate(paths.floatIP_id, this._id), '');
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
 * Returns all actions for the given FloatingIP
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
FloatingIP.prototype.getAllActions = function (sort) {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.floatIP_actions, this._id);
        if (sort) {
            path += '?sort=' + sort;
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
 * Return an action for a floating IP
 * @param {number} actionId The ActionID
 */
FloatingIP.prototype.getActionById = function (actionId) {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.floatIP_action_id, this._id, actionId));
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
 * Assigns a Floating IP to a server.
 * @param {number} serverId ID of the server the Floating IP shall be assigned to
 */
FloatingIP.prototype.assignToServer = function (serverId) {
    return new Promise(async (resolve, reject) => {
        let body = {
            server : serverId,
        };
        let result = await request.post(paths.translate(paths.floatIP_assign, this._id), JSON.stringify(body));
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
 * Unassigns a Floating IP, resulting in it being unreachable. You may assign it to a server again at a later time.
 */
FloatingIP.prototype.unassignToServer = function () {
    return new Promise(async (resolve, reject) => {
        let result = await request.post(paths.translate(paths.floatIP_unassign, this._id), '');
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
 * Changes the hostname that will appear when getting the hostname belonging to this Floating IP.
 * @param {string} ip IP address for which to set the reverse DNS entry
 * @param {string,null} dnsPTR Hostname to set as a reverse DNS PTR entry, will reset to original default value if null
 */
FloatingIP.prototype.changeReverseDNS = function(ip, dnsPTR) {
    return new Promise(async (resolve, reject) => {
        let body = {
            ip: ip,
            dns_ptr : dnsPTR,
        };
        let result = await request.post(paths.translate(paths.floatIP_reverse_dns, this._id), JSON.stringify(body));
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
 * Request all Floating IPs
 */
FloatingIP.getAllFloatingIps = () => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.floatIP_all));
        let floatingIps = [];
        let i;
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                for (i = 0; i < result.result.floating_ips.length; i += 1) {
                    floatingIps.push(new FloatingIP(result.result.floating_ips[i]));
                }
                resolve(floatingIps);
            }
        }
    });
};

/**
 * Request a specific Floating IP
 * @param {number} id The id of the Floating IP
 */
FloatingIP.getFloatingIpById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.floatIP_id, id));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new FloatingIP(result.result.floating_ip));
            }
        }
    });
};

/**
 * Create a new Floating IP
 * @param {string} type The type ('ipv4', 'ipv6')
 * @param {string} home_location Home location
 * @param {string} server Server to assign the Floating IP to
 * @param {string} description The description
 */
FloatingIP.createFloatingIp = (type, home_location, server, description) => {
    return new Promise(async (resolve, reject) => {
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
        let result = await request.post(paths.translate(paths.floatIP_all), JSON.stringify(body));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new FloatingIP(result.result.floating_ip));
            }
        }
    });
};
