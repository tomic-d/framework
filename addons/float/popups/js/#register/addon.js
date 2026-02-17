const popups = divhunt.Addon('popups', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('target', ['object', null]);
    addon.Field('content', ['string|function', '']);
    addon.Field('data', ['object', null]);
    addon.Field('position', ['object', {x: 'center', y: 'bottom'}]);
    addon.Field('offset', ['object', {x: 0, y: 0}]);
    addon.Field('flip', ['boolean', true]);
    addon.Field('padding', ['number', 10]);
    addon.Field('backdrop', ['number', null]);
    addon.Field('closeable', ['boolean', true]);
    addon.Field('escape', ['boolean', true]);
    addon.Field('show', ['boolean', false]);
    addon.Field('overlay', ['object', null]);
    addon.Field('onOpen', ['function', null]);
    addon.Field('onClose', ['function', null]);
});
