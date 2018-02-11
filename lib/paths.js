const format = require('string-format');
module.exports = {
    // Main Paths
    version: '',
    // Server
    server_all: 'servers',
    server_id: 'servers/{0}',
    server_power_on: 'servers/{0}/actions/poweron',
    server_soft_reboot: 'servers/{0}/actions/reboot',
    server_reset: 'servers/{0}/actions/reset',
    server_shutdown: 'servers/{0}/actions/shutdown',
    server_power_off: 'servers/{0}/actions/poweroff',
    server_reset_root_password: 'servers/{0}/actions/reset_password',
    server_enable_rescue: 'servers/{0}/actions/enable_rescue',
    server_disable_rescue: 'servers/{0}/actions/disable_rescue',
    server_create_image: 'servers/{0}/actions/create_image',
    server_rebuild_image: 'servers/{0}/actions/rebuild',
    server_change_type: 'servers/{0}/actions/change_type',
    server_enable_backup: 'servers/{0}/actions/enable_backup',
    server_disable_backup: 'servers/{0}/actions/disable_backup',
    server_attach_iso: 'servers/{0}/actions/attach_iso',
    server_deattach_iso: 'servers/{0}/actions/detach_iso',
    // Images
    image_all: 'images',
    image_id: 'images/{0}',
    // ISOS
    iso_all: 'isos',
    iso_id: 'isos/{0}',
    /**
     * Translate the path with the params
     * @param {string} path The path from this lib
     * @return {string} The ready path to use
     */
    translate: function(path, ...args) {
        return format('/' + this.version + '/' + path, args);
    },
};
