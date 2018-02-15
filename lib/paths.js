const format = require('string-format');
module.exports = {
    // Main Paths
    version: '',
    // Actions
    action_all: 'actions',
    action_id: 'actions/{0}',
    // Server
    server_actions: 'servers/{0}/actions', // Status & Sorting ?status={1}&sort={2}',
    server_action_id: 'servers/{0}/actions/{1}',
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
    server_reverse_dns: 'servers/{0}/actions/change_dns_ptr',
    // Images
    image_all: 'images',
    image_id: 'images/{0}',
    // ISOS
    iso_all: 'isos',
    iso_id: 'isos/{0}',
    // Floating IPs
    floatIP_all: 'floating_ips',
    floatIP_id: 'floating_ips/{0}',
    floatIP_actions: 'floating_ips/{0}/actions',
    floatIP_action_id: 'floating_ips/{0}/actions/{1}',
    floatIP_assign: 'floating_ips/{0}/actions/assign',
    floatIP_unassign: 'floating_ips/{0}/actions/unassign',
    floatIP_reverse_dns: 'floating_ips/{0}/actions/change_dns_ptr',
    // SSH Keys
    sshKey_all: 'ssh_keys',
    sshKey_id: 'ssh_keys/{0}',
    // Server Types
    serverTypes_all: 'server_types',
    serverTypes_id: 'server_types/{0}',
    // Locations
    location_all: 'locations',
    location_id: 'locations/{0}',
    // Pricing
    pricing: 'pricing',
    // Datacenter
    datacenter_all: 'datacenters',
    datacenter_id: 'datacenters/{0}',
    /**
     * Translate the path with the params
     * @param {string} path The path from this lib
     * @return {string} The ready path to use
     */
    translate: function(path, ...args) {
        return format('/' + this.version + '/' + path, args);
    },
};
