import commands from '#commands/core/addon.js';

commands.Fn('tests', async function()
{
    const items = Object.values(commands.Items());
    const list  = [];

    let passed = 0;
    let failed = 0;
    let total  = 0;

    for(const item of items)
    {
        const tests = item.Get('tests') || {};

        if(!Object.keys(tests).length)
        {
            continue;
        }

        const result = await item.Fn('tests');

        list.push({id: item.Get('id'), ...result});

        passed += result.passed;
        failed += result.failed;
        total  += result.total;
    }

    const percent = total ? Math.round(passed / total * 100) : 0;

    return {passed, failed, total, percent, commands: list};
});
