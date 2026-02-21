import commands from '#commands/core/addon.js';

commands.Fn('run', async function(id, data = {})
{
	const command = commands.ItemGet(id);

	if(!command)
	{
		throw new Error(`Command '${id}' not found.`);
	}

	return await command.Fn('run', data);
});
