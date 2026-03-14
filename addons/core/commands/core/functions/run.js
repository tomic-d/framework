import commands from '#commands/core/addon.js';

commands.Fn('run', async function(id, data = {})
{
	const command = commands.ItemGet(id);

	if(!command)
	{
		throw onetype.Error(404, 'Command :id: not found.', {id});
	}

	return await command.Fn('run', data);
});
