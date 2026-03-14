import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

/* Core */
import '#commands/core/item/functions/run.js';
import '#commands/core/functions/run.js';

/* Back */
import '#commands/back/functions/grpc/server.js';
import '#commands/back/functions/grpc/client.js';
import '#commands/back/functions/http/server.js';
import '#commands/back/functions/find.js';
import '#commands/back/functions/expose.js';
import '#commands/back/functions/hide.js';
import '#commands/back/items/self/one.js';
import '#commands/back/items/self/many.js';
import '#commands/back/items/self/run.js';

onetype.$ot.command = async function(id, properties = {}, api = false, context = {}, onChunk = null)
{
	if(api && onetype.environment === 'front')
	{
		return await commands.Fn('api', id, properties);
	}

	const command = commands.ItemGet(id);

	if(!command)
	{
		throw onetype.Error(404, 'Command :id: not found.', {id});
	}

	const result = await command.Fn('run', properties, onChunk, context);

	if(result.code !== 200)
	{
		throw onetype.Error(result.code, result.message);
	}

	return result.data;
};

export default commands;