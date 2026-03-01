onetype.AddonReady('directives', function()
{
	const handlers = new Set();

	document.addEventListener('click', function(event)
	{
		handlers.forEach((entry) =>
		{
			if(!document.contains(entry.element))
			{
				handlers.delete(entry);
				return;
			}

			if(!entry.element.contains(event.target) && entry.element !== event.target)
			{
				entry.handler(event);
			}
		});
	});

	directives.ItemAdd({
		id: 'ot-click-outside',
		icon: 'close_fullscreen',
		name: 'Click Outside',
		description: 'Detect clicks outside the element.',
		category: 'events',
		trigger: 'node',
		order: 500,
		attributes: {
			'ot-click-outside': ['string']
		},
		code: function(data, item, compile, node, identifier)
		{
			const attribute = data['ot-click-outside'].value;

			const handler = (event) =>
			{
				const results = onetype.Function(attribute, compile.data, false);

				if(typeof results === 'function')
				{
					results(event, {item, compile, node, identifier});
				}
			};

			handlers.add({element: node, handler});
		}
	});
});
