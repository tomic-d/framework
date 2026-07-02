import crud from '#database/addons/crud/addon.js';

function target(chain)
{
	return chain.operation === 'find' ? chain.query : chain.context;
}

crud.Item({
	id: 'language',
	type: ['find', 'create', 'update'],
	callback(chain, language)
	{
		target(chain).language = language;
		return chain;
	}
});

crud.Item({
	id: 'languages',
	type: ['find', 'create', 'update'],
	callback(chain, languages)
	{
		target(chain).languages = languages;
		return chain;
	}
});
