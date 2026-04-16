import onetype from '#framework/load.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.search = null;

	methods.search = (term) =>
	{
		query.search = typeof term === 'string' && term.trim() ? term.trim() : null;
		return methods;
	};
});
