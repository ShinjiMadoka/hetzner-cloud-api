/*
- Refactor ErrorHandling!!
- Refactor request.js
- Refactor GetAllServer -> incl. name filtering
- Test every action
*/

const Server = require('./lib/server');
const paths = require('./lib/paths');
const Image = require('./lib/image');
const Iso = require('./lib/iso');
const SSHKey = require('./lib/ssh_key');
const Pricing = require('./lib/pricing');
const Datacenter = require('./lib/datacenter');
const FloatingIP = require('./lib/floating_ip');
const Location = require('./lib/location');
const Action = require('./lib/action');
const ServerType = require('./lib/server_type');
const HError = require('./lib/herror');

exports.setConfig = (options) => {
    this._token = options.token;
    this._config = options.config;
    paths.version = this._config.version;
};

exports.getConfig = () => {
    return {
        token: this._token,
        config: this._config,
    };
};

exports.SSHKey = SSHKey;
exports.Server = Server;
exports.Image = Image;
exports.Iso = Iso;
exports.Pricing = Pricing;
exports.Datacenter = Datacenter;
exports.FloatingIP = FloatingIP;
exports.Location = Location;
exports.Action = Action;
exports.ServerType = ServerType;
exports.HError = HError;
