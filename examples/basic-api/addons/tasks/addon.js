import onetype from 'onetype';

const tasks = onetype.Addon('tasks', (addon) =>
{
    addon.Field('id', ['number']);
    addon.Field('title', ['string', null, true]);
    addon.Field('done', ['boolean', false]);
});

export default tasks;
