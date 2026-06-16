import database from '#database/addon.js';

database.Fn('find', function({connection = 'primary', language = null, languages = null, table, addon})
{
	/* connection may be a string id or a live knex/transaction object (in pipelines) */
	const knex = typeof connection === 'string' ? database.ItemGet(connection)?.Get('connection') : connection;

	const query = {
		sort: null,
		search: null,
		limit: 250,
		page: 1,
		offset: null,
		distinct: false,
		select: null,
		table,
		addon,
		knex,
		language,
		languages
	};

	return database.Fn('find.methods', query);
});
