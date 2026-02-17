import events from '../addon.js';

events.Fn('once', function(id, callback, opts = {})
{
    return this.Fn('on', id, callback, { ...opts, once: true });
});
