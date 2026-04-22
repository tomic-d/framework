import commands from '#commands/core/addon.js';

commands.Fn('item.tests', async function(item)
{
    const tests   = item.Get('tests') || {};
    const results = [];

    let passed = 0;
    let failed = 0;

    for(const name of Object.keys(tests))
    {
        const result = await item.Fn('test', name);

        results.push(result);

        if(result.passed)
        {
            passed++;
        }
        else
        {
            failed++;
        }
    }

    const total   = results.length;
    const percent = total ? Math.round(passed / total * 100) : 0;

    return {passed, failed, total, percent, results};
});
