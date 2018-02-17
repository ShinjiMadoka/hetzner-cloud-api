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
hcloud.Server.getServerById(1, (error, location) => {
    if (error) {
        console.log(error);
    } else {
        console.log(location);
    }
});
```

### Create a server
**Attentation! If your token is valid, this will create a server!**
```javascript
hcloud.Server.createServer('CloudAppOne', 'cx11', 'debian-9', (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result._options);
    }
});
```

## Documentation
For the "_options" field please visit the official documentation on [Hetzner](https://docs.hetzner.cloud/)
