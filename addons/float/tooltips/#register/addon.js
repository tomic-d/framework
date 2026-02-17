const tooltips = divhunt.Addon('tooltips', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('target', ['object', null]);
    addon.Field('text', ['string', '']);
    addon.Field('title', ['string', null]);
    addon.Field('icon', ['string', null]);
    addon.Field('variant', ['string', 'default']);
    addon.Field('position', ['object', {x: 'center', y: 'top'}]);
    addon.Field('offset', ['object', {x: 0, y: -4}]);
    addon.Field('show', ['boolean', true]);
    addon.Field('overlay', ['object', null]);
    addon.Field('onOpen', ['function', null]);
    addon.Field('onClose', ['function', null]);
});
