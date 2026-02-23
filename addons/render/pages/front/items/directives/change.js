onetype.AddonReady('directives', function()
{
	directives.ItemAdd({
		id: 'ot-page',
		icon: 'file',
		name: 'Page',
		description: 'Navigate to a page on render',
		category: 'navigation',
		trigger: 'node',
		order: 666,
		strict: false,
		tag: 'ot-page',
		attributes: {
			'route': ['string', null, true],
			'parameters': ['object', {}],
			'history': ['boolean', true],
			'timeout': ['number', 0]
		},
		code: function(data, item, compile, node, identifier)
		{
			const route = data['route'].value;
			const parameters = data['parameters'].value;
			const push = data['history'].value;
			const timeout = data['timeout'].value;

			const change = () =>
			{
				pages.Fn('change', route, parameters, { path: true, push });
			};

			if(timeout > 0)
			{
				setTimeout(change, timeout);
			}
			else
			{
				change();
			}
		}
	});
});
