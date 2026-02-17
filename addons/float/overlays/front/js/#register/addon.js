const overlays = divhunt.Addon('overlays', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('render', ['function', null]);
    addon.Field('element', ['object', null]);
    addon.Field('target', ['object', null]);
    addon.Field('position', ['object', {x: 'center', y: 'center'}]);
    addon.Field('offset', ['object', {x: 0, y: 0}]);
    addon.Field('flip', ['boolean', true]);
    addon.Field('padding', ['number', 10]);
    addon.Field('index', ['number', 100000]);
    addon.Field('backdrop', ['number', null]);
    addon.Field('closeable', ['boolean', false]);
    addon.Field('escape', ['boolean', false]);
    addon.Field('onOpen', ['function', null]);
    addon.Field('onClose', ['function', null]);
});
