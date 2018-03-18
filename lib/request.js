const https = require('https');
const first = require('../');
const querystring = require('querystring');

this._host = 'api.hetzner.cloud';
this._port = 443;

exports.get = (path) => { //, callback) => {
    let options = {
        host: this._host,
        port: this._port,
        path: path,
        headers: {
            'Authorization': 'Bearer ' + first._token,
        },
    };
    return new Promise((resolve) => {
        https.get(options, function(res) {
            let body = '';
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                if (res.statusCode === 200) {
                    resolve({
                        err: undefined,
                        result: JSON.parse(body),
                    });
                } else {
                    resolve({
                        err: true,
                        status: res.statusCode,
                        result: JSON.parse(body),
                    });
                }
            });
            res.on('error', function(e) {
                resolve({
                    err: true,
                    status: res.statusCode,
                    stack: e,
                    result: undefined,
                });
            });
        });
    });
};

exports.post = (path, bodyStr) => {
    let options = {
        host: this._host,
        port: this._port,
        path: path,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + first._token,
            'Content-Type': 'application/json',
            'Content-Length': bodyStr.length,
        },
    };
    return new Promise((resolve) => {
        let postreq = https.request(options, (res) => {
            let body = '';
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                if (res.statusCode < 300) {
                    resolve({
                        err: undefined,
                        result: JSON.parse(body),
                    });
                } else {
                    resolve({
                        err: true,
                        status: res.statusCode,
                        result: JSON.parse(body),
                    });
                }
            });
            res.on('error', function(e) {
                resolve({
                    err: true,
                    status: res.statusCode,
                    stack: e,
                    result: JSON.parse(body),
                });
            });
        });
        postreq.write(bodyStr);
        postreq.end();
    });
};

exports.put = (path, bodyStr) => {
    // let bodyRequest = querystring.stringify(body);
    let options = {
        host: this._host,
        port: this._port,
        path: path,
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + first._token,
            'Content-Type': 'application/json',
            'Content-Length': bodyStr.length,
        },
    };
    return new Promise((resolve) => {
        let postreq = https.request(options, (res) => {
            let body = '';
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                if (res.statusCode < 300) {
                    resolve({
                        err: undefined,
                        result: JSON.parse(body),
                    });
                } else {
                    resolve({
                        err: true,
                        status: res.statusCode,
                        result: JSON.parse(body),
                    });
                }
            });
            res.on('error', function(e) {
                resolve({
                    err: true,
                    status: res.statusCode,
                    stack: e,
                    result: JSON.parse(body),
                });
            });
        });
        postreq.write(bodyStr);
        postreq.end();
    });
};

exports.delete = (path, body) => {
    let bodyRequest = querystring.stringify(body);
    let options = {
        host: this._host,
        port: this._port,
        path: path,
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + first._token,
            'Content-Type': 'application/json',
            'Content-Length': bodyRequest.length,
        },
    };
    return new Promise((resolve) => {
        let postreq = https.request(options, (res) => {
            let body = '';
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                if (res.statusCode < 300) {
                    resolve({
                        err: undefined,
                        result: JSON.parse(body),
                    });
                } else {
                    resolve({
                        err: true,
                        status: res.statusCode,
                        result: JSON.parse(body),
                    });
                }
            });
            res.on('error', function(e) {
                resolve({
                    err: true,
                    status: res.statusCode,
                    stack: e,
                    result: JSON.parse(body),
                });
            });
        });
        postreq.write(bodyRequest);
        postreq.end();
    });
};
