import onetype from 'onetype';

const agents = onetype.Addon('agents', (addon) =>
{
    addon.Field('id', ['string|number']);
    addon.Field('name', ['string', 'JSON']);
    addon.Field('description', ['string', '']);
    addon.Field('instructions', ['string', '']);
    addon.Field('commands', ['array', []]);
    addon.Field('tokens', ['number', 8000]);
    addon.Field('provider', ['string', '']);
    addon.Field('model', ['string', '']);

    addon.Field('condition', ['function']);

    addon.Field('temperature', ['number', 0.1]);
    addon.Field('top_p', ['number', 0.9]);
    addon.Field('top_k', ['number', 40]);
    addon.Field('presence_penalty', ['number', 0]);

    addon.Field('format', ['string', 'json']);
    addon.Field('input', ['object', {}]);
    addon.Field('output', ['object|function', {}]);

    addon.Field('onBefore', ['function']);
    addon.Field('onAfter', ['function']);

    addon.Field('onSuccess', ['function']);
    addon.Field('onFail', ['function']);
});

export default agents;
