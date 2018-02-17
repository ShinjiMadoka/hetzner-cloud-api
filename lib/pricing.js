const request = require('./request');
const paths = require('./paths');
const HError = require('./herror');

module.exports = Pricing;

/**
 * Instance of a Datacenter Object with interactions
 * @param {*} options Config from the Datacenter
 */
function Pricing(options) {
    this._options = options;
    this._id = options.id;
}

/**
 * Returns prices for resources.
 * @param {Pricing} callback Callback with the Pricing result
 */
Pricing.getPricing = (callback) => {
    request.get(paths.translate(paths.pricing), (result) => {
        if (result.err && result.status >= 300) {
            if (result.result && callback) {
                callback(new HError(result.result.error, result.status), undefined);
            }
        } else {
            if (result.result && callback) {
                callback(undefined, new Pricing(result.result.pricing));
            }
        }
    });
};