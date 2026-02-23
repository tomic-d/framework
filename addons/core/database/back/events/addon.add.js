import onetype from '#framework/load.js';

onetype.EmitOn('addon.add', (addon) =>
{
    addon.expose = null;

    addon.Expose = function(config)
    {
        config = onetype.DataDefine(config, {
            filter: ['array', []],
            sort: ['array', []],
            select: ['array', []],
            callback: ['function']
        });

        addon.expose = config;
    };
});
