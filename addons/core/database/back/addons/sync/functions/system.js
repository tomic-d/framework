import database from '#database/addon.js';

/* Ensure the framework's own system tables exist on a connection.
   The framework writes/reads these but never created them. Idempotent. */

database.Fn('sync.system', async function(knex)
{
	if(!await knex.schema.hasTable('database_versions'))
	{
		await knex.schema.createTable('database_versions', (table) =>
		{
			table.bigIncrements('id').primary();
			table.bigInteger('site_id');
			table.string('addon', 64).notNullable();
			table.bigInteger('entity_id').notNullable();
			table.string('operation', 16).notNullable();
			table.json('changes').notNullable();
			table.string('language', 16);
			table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
			table.index(['addon', 'entity_id', 'id'], 'database_versions_entity');
			table.index(['site_id', 'id'], 'database_versions_cutoff');
		});
	}

	if(!await knex.schema.hasTable('database_translations'))
	{
		await knex.schema.createTable('database_translations', (table) =>
		{
			table.string('entity', 64).notNullable();
			table.bigInteger('entity_id').notNullable();
			table.string('language', 16).notNullable();
			table.string('field', 64).notNullable();
			table.text('value');
			table.timestamp('updated_at', { useTz: true });
			table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
			table.primary(['entity', 'entity_id', 'language', 'field']);
		});
	}
});
