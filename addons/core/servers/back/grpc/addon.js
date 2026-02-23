import onetype from '#framework/load.js';

const serversGRPC = onetype.Addon('servers.grpc', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('instance', ['object']);
    addon.Field('port', ['number', 50000]);
    addon.Field('host', ['string', '0.0.0.0']);

    addon.Field('onError', ['function']);
    addon.Field('onStart', ['function']);
    
    addon.Field('onStreamConnect', ['function']);
    addon.Field('onStreamError', ['function']);
    addon.Field('onStreamEnd', ['function']);
    addon.Field('onStreamData', ['function']);
    addon.Field('onStreamRequest', ['function']);
    addon.Field('onStreamRespond', ['function']);
});

export default serversGRPC;