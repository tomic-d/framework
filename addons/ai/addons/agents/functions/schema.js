import ai from '#ai/addon.js';

ai.agents.Fn('schema', function(fields)
{
	const schema = { type: 'object', properties: {}, required: [], additionalProperties: false };

	if (!fields || typeof fields !== 'object')
	{
		return schema;
	}

	for (const [key, field] of Object.entries(fields))
	{
		if (field.populate === false)
		{
			continue;
		}

		const type = field.type || 'string';
		const prop = { type };

		if (type === 'array')
		{
			prop.items = field.each?.config ? this.Fn('schema', field.each.config) : (field.each || { type: 'string' });
		}

		if (type === 'object' && field.config)
		{
			Object.assign(prop, this.Fn('schema', field.config));
		}

		if (field.options)
		{
			prop.enum = field.options;
		}

		if (field.required === false)
		{
			prop.type = [prop.type, 'null'];
		}
		else
		{
			schema.required.push(key);
		}

		schema.properties[key] = prop;
	}

	return schema;
});
