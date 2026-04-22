import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

commands.Fn('item.test', async function(item, name)
{
    const tests = item.Get('tests') || {};
    const test  = tests[name];

    if(!test)
    {
        throw onetype.Error(404, 'Test :name: not found on command :id:.', {name, id: item.Get('id')});
    }

    const config = onetype.DataDefine({...test}, {
        description: ['string', ''],
        properties:  ['object', {}],
        code:        ['number', 200],
        out:         ['object', {}]
    });

    const result = await item.Fn('run', {...config.properties});

    let passed = result.code === config.code;

    if(passed && Object.keys(config.out).length)
    {
        try
        {
            onetype.DataDefine(result.data && typeof result.data === 'object' ? {...result.data} : {}, onetype.DataConfig(config.out));
        }
        catch(e)
        {
            passed = false;
        }
    }

    return {...result, passed, name};
});
