import commands from '#commands/core/addon.js';

commands.Fn('expose', function(id, endpoint = null)
{
    const command = commands.ItemGet(id);

    if(!command)
    {
        return;
    }

    command.Set('exposed', true);
    command.Set('endpoint', endpoint || '/api/' + id.replace(/:/g, '/'));
});
