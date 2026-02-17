const toasts = divhunt.Addon('toasts', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('type', ['string', 'info']);
    addon.Field('message', ['string', '']);
    addon.Field('title', ['string', null]);
    addon.Field('icon', ['string', null]);
    addon.Field('duration', ['number', 5000]);
    addon.Field('closeable', ['boolean', true]);
    addon.Field('position', ['object', {x: 'right-in', y: 'top-in'}]);
    addon.Field('padding', ['number', 16]);
    addon.Field('show', ['boolean', true]);
    addon.Field('overlay', ['object', null]);
    addon.Field('timer', ['number', null]);
    addon.Field('onOpen', ['function', null]);
    addon.Field('onClose', ['function', null]);
});
