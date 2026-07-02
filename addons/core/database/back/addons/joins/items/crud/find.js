import onetype from '#framework/load.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'join',
	type: ['find'],
	callback(chain, addon, field, output = null, builder = null)
	{
		const query = chain.query;
		query.joins = query.joins || [];

		let required = false;

		if(addon.startsWith('*'))
		{
			required = true;
			addon = addon.slice(1);
		}

		const config = query.addon.FieldGet(field);

		if(!config)
		{
			throw onetype.Error(400, 'Join field :field: not found on :addon:.', { field, addon: query.addon.name });
		}

		const out = output || field;
		const parsed = onetype.DataParseConfig(config.define);
		const many = parsed.type.includes('array');
		const existing = query.addon.FieldGet(out);

		if(existing)
		{
			if(!onetype.DataParseConfig(existing.define).virtual)
			{
				throw onetype.Error(400, 'Join output :output: already exists on :addon:.', { output: out, addon: query.addon.name });
			}
		}
		else
		{
			query.addon.Field(out, many ? { type: 'array', value: [], virtual: true } : { type: 'object', virtual: true });
		}

		query.joins.push({ addon, field, output: out, many, builder, required, parent: chain });

		return chain;
	}
});
