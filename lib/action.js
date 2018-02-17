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
 * @param {*} callback The result of the request
 * @param {string} status 'running', 'success', 'error'
 * @param {string} sort id id:asc id:desc command command:asc command:desc status status:asc status:desc progress progress:asc progress:desc started started:asc started:desc finished finished:asc finished:desc
 */
Action.getAll = (callback, status, sort) => {
    let path = paths.translate(paths.action_all);
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

Action.ActionById = (id, callback) => {
    request.get(paths.translate(paths.action_id, id), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Action(result.result.server));
            }
        }
    });
};
