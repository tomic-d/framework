import sync from '#database/addons/sync/addon.js';

sync.Fn('apply.column', function(table, column)
{
	let builder;

	if(column.primary)
	{
		if(column.auto)
		{
			table.bigIncrements(column.name).primary();
			return;
		}

		table.string(column.name, 255).primary();
		return;
	}

	if(column.cast === 'date')
	{
		builder = table.timestamp(column.name, { useTz: true });
	}
	else if(column.type === 'number' && column.precision !== undefined)
	{
		builder = table.decimal(column.name, column.precision, column.scale || 0);
	}
	else if(column.type === 'number')
	{
		builder = table.bigInteger(column.name);

		if(column.unsigned)
		{
			builder.unsigned();
		}
	}
	else if(column.type === 'boolean')
	{
		builder = table.boolean(column.name);
	}
	else if(column.type === 'object' || column.type === 'array')
	{
		builder = table.jsonb(column.name);
	}
	else if(column.type === 'string' && column.length !== undefined)
	{
		builder = table.string(column.name, column.length);
	}
	else if(column.bounded)
	{
		builder = table.string(column.name, 255);
	}
	else
	{
		builder = table.text(column.name);
	}

	if(column.required && column.value !== undefined)
	{
		builder.notNullable().defaultTo(column.value);
	}
	else if(column.value !== undefined && typeof column.value !== 'object')
	{
		builder.defaultTo(column.value);
	}
});
