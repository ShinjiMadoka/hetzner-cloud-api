const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = Action;

/**
 * Instance of an action Object with interactions
 * @param {object} options The action informations
 */
function Action(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns the action object as reference
 * @return {object} Actionobject
 */
Action.prototype.getInformation = function() {
    return this._options;
};

/**
 * Return all actions
 * @param {string} status 'running', 'success', 'error'
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
Action.getAll = (status, sort) => {
    return new Promise(async (resolve, reject) => {
        let path = paths.translate(paths.action_all);
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

Action.ActionById = (id) => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.action_id, id));
        if (result.err && result.status >= 300) {
            if (result.resul) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Action(result.result.server));
            }
        }
    });
};
