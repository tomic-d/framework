import database from '#database/addon.js';

/* Apply one column descriptor to a knex table builder. knex maps each builder
   method per dialect.
   primary auto -> auto-increment PK (bigserial / AUTO_INCREMENT / AUTOINCREMENT).
   primary non-auto -> plain PK on a bounded string (the app supplies the id).
   *_at -> timestamp.
   object/array -> jsonb (pg containment ops); json on mysql; text on sqlite.
   bounded string -> varchar(255) (mysql rejects a key on unbounded TEXT).
   everything else by type. */

database.Fn('sync.column', function(table, column)
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

	if(column.name.endsWith('_at'))
	{
		builder = table.timestamp(column.name, { useTz: true });
	}
	else if(column.type === 'number')
	{
		builder = table.bigInteger(column.name);
	}
	else if(column.type === 'boolean')
	{
		builder = table.boolean(column.name);
	}
	else if(column.type === 'object' || column.type === 'array')
	{
		builder = table.jsonb(column.name);
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
