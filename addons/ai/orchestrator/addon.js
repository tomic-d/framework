import onetype from 'onetype';

const orchestrator = onetype.Addon('orchestrator', (addon) =>
{
	addon.Field('id', ['string|number']);
	addon.Field('prompt', ['string']);
	addon.Field('agents', ['array', []]);
	addon.Field('data', ['object', {}]);
	addon.Field('status', ['string', 'idle']);
	addon.Field('state', ['object', null]);
	addon.Field('history', ['array', []]);
	addon.Field('concurrency', ['number', 2]);
	addon.Field('steps', ['number', 10]);

	addon.Field('provider', ['string', '']);

	addon.Field('onTasks', ['function', null]);
	addon.Field('onStep', ['function', null]);
	addon.Field('onSummary', ['function', null]);
	addon.Field('onSuccess', ['function', null]);
	addon.Field('onFail', ['function', null]);
});

export default orchestrator;
