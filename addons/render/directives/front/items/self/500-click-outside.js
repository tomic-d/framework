onetype.AddonReady('directives', function()
{
	const tracked = new Set();

	document.addEventListener('click', function(event)
	{
		tracked.forEach((entry) =>
		{
			if(!document.contains(entry.element))
			{
				tracked.delete(entry);
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
		trigger: 'node',
		order: 500,
		attributes: { 'ot-click-outside': ['string'] },
		code: function(data, item, compile, node)
		{
			const attribute = data['ot-click-outside'].value;

			tracked.add({
				element: node,
				handler: (event) =>
				{
					const result = onetype.Function(attribute, compile.data, false);

					if(typeof result === 'function')
					{
						result({ event });
					}
				}
			});
		}
	});
});
