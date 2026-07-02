import versions from '#database/addons/versions/addon.js';

versions.Fn('apply.write', async function(transaction, addon, { entity, operation, changes, language = null })
{
	await transaction('database_versions').insert({
		addon: addon.name,
		entity_id: entity,
		operation,
		changes,
		language
	});
});
