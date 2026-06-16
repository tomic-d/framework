import ai from '#ai/addon.js';

ai.agents.Fn('describe', function(fields, indent = 0)
{
	const lines = [];

	for (const [key, field] of Object.entries(fields))
	{
		if (field.populate === false)
		{
			continue;
		}

		lines.push('  '.repeat(indent) + '- ' + key + ' [' + field.type + ']: ' + field.description);

		const nested = field.each?.config || field.config;

		if (nested)
		{
			lines.push(this.Fn('describe', nested, indent + 1));
		}
	}

	return lines.join('\n');
});
