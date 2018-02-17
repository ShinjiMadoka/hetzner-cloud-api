module.exports = HError;

/**
 * Instance of an Error Object with interactions
 * @param {*} options The error Content
 * @param {number} status The HTTP Status Code
 */
function HError(options, status) {
    this._options = options;
    this._status = status;
}

/**
 * Returns the HTTP StatusCode
 */
HError.prototype.getStatus = function () {
    return this._status;
};
