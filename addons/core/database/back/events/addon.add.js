import divhunt from '#framework/load.js';

divhunt.EmitOn('addon.add', (addon) =>
{
    addon.expose = null;

    addon.Expose = function(config)
    {
        config = divhunt.DataDefine(config, {
            filter: ['array', []],
            sort: ['array', []],
            select: ['array', []],
            callback: ['function']
        });

        addon.expose = config;
    };
});
