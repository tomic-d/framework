import onetype from '#framework/load.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.joins = [];

	methods.join = (addon, field, output = null, builder = null) =>
	{
		let required = false;

		if(addon.startsWith('*'))
		{
			required = true;
			addon = addon.slice(1);
		}

		const config = query.addon.FieldGet(field);

		if(!config)
		{
			throw new Error(`Field '${field}' not found on '${query.addon.name}'.`);
		}

		const out = output || field;
		const parsed = onetype.DataParseConfig(config.define);
		const many = parsed.type.includes('array');
		const existing = query.addon.FieldGet(out);

		if(existing)
		{
			const existingParsed = onetype.DataParseConfig(existing.define);

			if(!existingParsed.virtual)
			{
				throw new Error(`Field '${out}' already exists on '${query.addon.name}'.`);
			}
		}
		else
		{
			query.addon.Field(out, many
				? { type: 'array', value: [], virtual: true }
				: { type: 'object', virtual: true });
		}

		query.joins.push({ addon, field, output: out, many, builder, required });

		return methods;
	};
});
