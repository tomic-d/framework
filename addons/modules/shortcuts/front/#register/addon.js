import divhunt from '#divhunt';

const shortcuts = divhunt.Addon('shortcuts', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('name', ['string', null]);
    addon.Field('group', ['string', null]);
    addon.Field('description', ['string', null]);
    addon.Field('key', ['string']);
    addon.Field('context', ['string', null]);
    addon.Field('target', ['string', null]);
    addon.Field('action', ['string|object', null]);
    addon.Field('command', ['string|object', null]);
    addon.Field('callback', ['function', null]);
    addon.Field('condition', ['string|function', null]);
    addon.Field('enabled', ['boolean', true]);
    addon.Field('prevent', ['boolean', true]);
    addon.Field('stop', ['boolean', false]);
    addon.Field('priority', ['number', 0]);
});

export default shortcuts;
