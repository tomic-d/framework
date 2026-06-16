import database from '#database/addon.js';

/* Sync one addon's table to its field definitions.
   Create the table if missing; add missing columns; warn on extra columns
   (never drop, unless the addon opts in with Table(name, {prune:true})). */

database.Fn('sync.table', async function(knex, addon)
{
	const config = addon.Table();
	const table = config.name;
	const columns = database.Fn('sync.columns', addon);

	const index = addon.Index();
	const unique = addon.Unique();

	const keys = async (builder) =>
	{
		index.forEach((group) => builder.index(group, `${table}_${group.join('_')}_index`));
		unique.forEach((group) => builder.unique(group, { indexName: `${table}_${group.join('_')}_unique` }));
	};

	if(!await knex.schema.hasTable(table))
	{
		await knex.schema.createTable(table, (builder) =>
		{
			columns.forEach((column) => database.Fn('sync.column', builder, column));
		});

		if(index.length || unique.length)
		{
			await knex.schema.alterTable(table, keys);
		}

		return;
	}

	const { missing, extra, mismatched } = await database.Fn('sync.diff', knex, table, columns);

	if(missing.length)
	{
		await knex.schema.alterTable(table, (builder) =>
		{
			missing.forEach((column) => database.Fn('sync.column', builder, column));
		});
	}

	const addIndex = await database.Fn('sync.keys', knex, table, index, false);
	const addUnique = await database.Fn('sync.keys', knex, table, unique, true);

	if(addIndex.length || addUnique.length)
	{
		await knex.schema.alterTable(table, (builder) =>
		{
			addIndex.forEach((group) => builder.index(group, `${table}_${group.join('_')}_index`));
			addUnique.forEach((group) => builder.unique(group, { indexName: `${table}_${group.join('_')}_unique` }));
		});
	}

	if(extra.length)
	{
		if(config.prune)
		{
			await knex.schema.alterTable(table, (builder) =>
			{
				extra.forEach((name) => builder.dropColumn(name));
			});
		}
		else
		{
			extra.forEach((name) => console.warn(`[database.sync] table "${table}" has extra column "${name}" not in the schema (kept; set Table('${table}', { prune: true }) to drop).`));
		}
	}

	mismatched.forEach((name) => console.warn(`[database.sync] table "${table}" column "${name}" should be a JSON type but is not (kept; migrate it to jsonb/json manually).`));
});
