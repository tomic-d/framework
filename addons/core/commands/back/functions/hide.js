import commands from '#commands/core/addon.js';

commands.Fn('hide', function(id)
{
    const command = commands.ItemGet(id);

    if(!command)
    {
        return;
    }

    command.Set('exposed', false);
    command.Set('endpoint', null);
});
