import onetype from '#framework/load.js';
import database from '#database/addon.js';
import crud from '#database/addons/crud/addon.js';

crud.Item({
	id: 'select',
	type: ['find'],
	callback(chain, fields)
	{
		fields = Array.isArray(fields) ? fields : [fields];

		if(!fields.length)
		{
			throw onetype.Error(400, 'Select needs at least one field.');
		}

		fields.forEach((field) => crud.Fn('validate.field', field));

		chain.query.select = fields.map((field) => database.Fn('column', chain.query.addon, field));
		return chain;
	}
});
