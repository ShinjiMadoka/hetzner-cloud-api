# hetzner-cloud-api
A API in NodeJS for the Hetzner Cloud

**This modul is currently in developing!**

## Example
### Init the modul
```javascript
hcloud = require('hetzner-cloud-api');
hcloud.setConfig({
    token: 'YOUR_TOKEN',
    config: {
        version: 'v1',
    },
});
```
### Request a server by id
```javascript
hcloud.Server.getServerById(123).then((server) => {
    console.log(server);
}).catch((error) => {
    console.log(error);
});
```

### Create a server
**Attentation! If your token is valid, this will create a server!**
```javascript
hcloud.Server.createServer('CloudServer', 'cx11', 'debian-9').then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});
```

## Documentation
For the "_options" field please visit the official documentation on [Hetzner](https://docs.hetzner.cloud/)
