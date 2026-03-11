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

onetype.$ot.command = async function(id, properties = {}, onChunk = null, context = {})
{
	const command = commands.ItemGet(id);

	if(!command)
	{
		throw new Error(`Command '${id}' not found.`);
	}

	const result = await command.Fn('run', properties, onChunk, context);

	if(result.code !== 200)
	{
		throw new Error(result.message);
	}

	return result.data;
};

export default commands;