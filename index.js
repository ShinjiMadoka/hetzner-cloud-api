const Server = require('./lib/server');
// const snapshot = require('./lib/snapshot');
const paths = require('./lib/paths');
const Image = require('./lib/image');
const Iso = require('./lib/iso');

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

exports.getAllServer = (callback) => {
    Server.getAllServer(callback);
};

exports.getServerById = (id, callback) => {
    Server.getServerById(id, callback);
};

exports.createServer = (name, serverType, image, callback, datacenter, location, startAfterCreate, sshKeys, userData) => {
    Server.createServer(name, serverType, image, (result) => {
        callback(result);
    });
};

exports.getImages = (callback) => {
    Image.getAllImages((result) => {
        callback(result);
    });
};

exports.getImageById = (id, callback) => {
    Image.getImage(id, (result) => {
        callback(result);
    });
};

exports.getAllIsos = (callback) => {
    Iso.getAllIsos((result) => {
        callback(result);
    });
};

exports.getIsoById = (id, callback) => {
    Iso.getIso(id, (result) => {
        callback(result);
    });
};

