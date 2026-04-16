import database from '#database/addon.js';

database.Fn('find', function({connection = 'primary', language = null, languages = null, table, addon})
{
	const knex = database.ItemGet(connection)?.Get('connection');

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
