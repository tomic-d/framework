import database from '#database/addon.js';

database.Fn('items.find', function({connection = 'primary', translation = 'en', table, addon})
{
	const knex = database.ItemGet(connection)?.Get('connection');

	const query = {
		filters: [],
		joins: [],
		sort: null,
		limit: 10,
		page: 1,
		distinct: false,
		select: null,
		table,
		addon,
		knex,
		translation,
		operators: [
			'EQUALS', 'NOT EQUALS', 'LESS', 'GREATER', 'LESS EQUALS', 'GREATER EQUALS',
			'LIKE', 'NOT LIKE', 'ILIKE', 'NOT ILIKE', 'IN', 'NOT IN',
			'BETWEEN', 'NOT BETWEEN', 'NULL', 'NOT NULL',
			'CONTAINS', 'CONTAINED', 'HAS'
		]
	};

	return database.Fn('items.methods', query);
});
