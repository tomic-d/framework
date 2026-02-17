import bugs from '../addon.js';

bugs.Fn('push', function(source, message, code = null, data = null, type = 'error', notify = 'console')
{
    const item = this.Item({
        source,
        message,
        code,
        data,
        type,
        notify
    });

    return item;
});
