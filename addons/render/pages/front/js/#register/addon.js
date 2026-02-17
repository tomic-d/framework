const pages = divhunt.Addon('pages', (addon) =>
{
	addon.Field('id', ['string']);
	addon.Field('route', ['string|array']);
	addon.Field('title', ['string|function']);
	addon.Field('meta', ['object', {}]);
	addon.Field('data', ['function']);

	addon.Field('grid', {
		type: 'object',
		value: {},
		config: {
			template: ['string', '"main"'],
			columns: ['string', '1fr'],
			rows: ['string', '1fr'],
			gap: ['string', '0']
		}
	});

	addon.Field('areas', ['object', {}]);

	addon.Field('onBeforeLeave', ['function']);
	addon.Field('onLeave', ['function']);
	addon.Field('onBeforeEnter', ['function']);
	addon.Field('onEnter', ['function']);

	addon.Field('element', ['object']);
	addon.Field('404', ['boolean', false]);
});
