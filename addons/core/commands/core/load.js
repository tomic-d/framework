import onetype from '#framework/load.js';
import commands from '#commands/core/addon.js';

/* Core */
import '#commands/core/item/functions/run.js';
import '#commands/core/item/functions/test.js';
import '#commands/core/item/functions/tests.js';
import '#commands/core/functions/run.js';
import '#commands/core/functions/tests.js';

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
		return { data: null, message: 'Command ' + id + ' not found.', code: 404 };
	}

	return await command.Fn('run', properties, onChunk, context);
};

export default commands;