onetype.AddonReady('directives', function(directives)
{
	document.addEventListener('click', function(event)
	{
		const nodes = document.querySelectorAll('[ot-click-outside-bound]');

		nodes.forEach((node) =>
		{
			if(!node.otClickOutside)
			{
				return;
			}

			if(!node.contains(event.target) && node !== event.target)
			{
				node.otClickOutside(event);
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

			node.setAttribute('ot-click-outside-bound', '');

			node.otClickOutside = (event) =>
			{
				const result = onetype.Function(attribute, compile.data, false);

				if(typeof result === 'function')
				{
					result({ event });
				}
			};
		}
	});
});