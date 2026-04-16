import onetype from '#framework/load.js';

onetype.EmitOn('@database.find', ({ methods, query }) =>
{
	query.versionId = null;

	methods.version = (id) =>
	{
		query.versionId = id;
		return methods;
	};
});
