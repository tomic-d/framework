import divhunt from '#framework/load.js';

const queue = divhunt.Addon('queue', (addon) =>
{
    addon.Field('id', ['string']);

    addon.Field('concurrency', ['number', 10]);
    addon.Field('timeout', ['number', 5000]);

    addon.Field('onTaskStart', ['function']);
    addon.Field('onTaskEnd', ['function']);
    addon.Field('onEmpty', ['function']);
    addon.Field('onRun', ['function']);
    addon.Field('whileRunning', ['function']);

    addon.Field('running', ['boolean', true]);

    addon.Field('tasks', ['array', []]);
});

export default queue;