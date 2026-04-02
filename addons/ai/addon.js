import onetype from '#framework/load.js';

const ai = onetype.Addon('ai', (ai) =>
{
	ai.providers = onetype.Addon('ai.providers', (addon) =>
	{
		addon.Field('id', ['string']);
		addon.Field('name', ['string', '']);
		addon.Field('endpoint', ['string']);
		addon.Field('key', ['string', '']);
		addon.Field('default', ['boolean', false]);
		addon.Field('model', ['string', '']);
		addon.Field('models', ['object', {}]);
		addon.Field('onBeforeRequest', ['function']);
		addon.Field('onAfterRequest', ['function']);
		addon.Field('onParse', ['function']);
	});

	ai.agents = onetype.Addon('ai.agents', (addon) =>
	{
		addon.Field('id', ['string|number']);
		addon.Field('name', ['string', '']);
		addon.Field('description', ['string', '']);
		addon.Field('instructions', ['string', '']);
		addon.Field('commands', ['array', []]);
		addon.Field('tokens', ['number', 8000]);
		addon.Field('provider', ['string', '']);
		addon.Field('model', ['string', '']);

		addon.Field('condition', ['function']);

		addon.Field('temperature', ['number', 0]);
		addon.Field('top_p', ['number', 0.9]);
		addon.Field('top_k', ['number', 20]);
		addon.Field('presence_penalty', ['number', 0]);

		addon.Field('format', ['string', 'json']);
		addon.Field('input', ['object', {}]);
		addon.Field('output', ['object|function', {}]);

		addon.Field('onBefore', ['function']);
		addon.Field('onAfter', ['function']);
		addon.Field('onSuccess', ['function']);
		addon.Field('onFail', ['function']);
	});

	ai.pipelines = onetype.Addon('ai.pipelines', (addon) =>
	{
		addon.Field('id', ['string']);
		addon.Field('name', ['string', '']);
		addon.Field('description', ['string', '']);
		addon.Field('usage', ['number', 0]);
		addon.Field('steps', ['array', []]);
	});

	ai.orchestrators = onetype.Addon('ai.orchestrators', (addon) =>
	{
		addon.Field('id', ['string|number']);
		addon.Field('parent', ['string']);
		addon.Field('prompt', ['string']);
		addon.Field('agents', ['array', []]);
		addon.Field('data', ['object', {}]);
		addon.Field('status', ['string', 'idle']);
		addon.Field('state', ['object', null]);
		addon.Field('history', ['array', []]);
		addon.Field('steps', ['number', 10]);

		addon.Field('provider', ['string', '']);

		addon.Field('onTasks', ['function', null]);
		addon.Field('onStep', ['function', null]);
		addon.Field('onSummary', ['function', null]);
		addon.Field('onSuccess', ['function', null]);
		addon.Field('onFail', ['function', null]);
	});
});

export default ai;
