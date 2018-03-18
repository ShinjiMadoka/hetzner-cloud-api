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
 */
Pricing.getPricing = () => {
    return new Promise(async (resolve, reject) => {
        let result = await request.get(paths.translate(paths.pricing));
        if (result.err && result.status >= 300) {
            if (result.result) {
                reject(new HError(result.result.error, result.status));
            }
        } else {
            if (result.result) {
                resolve(new Pricing(result.result.pricing));
            }
        }
    });
};