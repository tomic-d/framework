import ai from '#ai/addon.js';

ai.agents.Fn('item.describe', function(item, fields, indent = 0)
{
	const lines = [];

	for (const [key, field] of Object.entries(fields))
	{
		if (field.populate === false) 
		{
			continue
		};

		const prefix = '  '.repeat(indent) + '- ';
		const description = '[' + field.type + ']: ' + field.description;

		lines.push(prefix + '' + key + '' + description);

		const nested = field.each?.config || field.config;

		if (nested)
		{
			lines.push(item.Fn('describe', nested, indent + 1));
		}
	}

	return lines.join('\n');
});