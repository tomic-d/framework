onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-mouse-enter',
		trigger: 'node',
		order: 500,
		attributes: { 'ot-mouse-enter': ['string'] },
		code: function(data, item, compile, node)
		{
			const attribute = data['ot-mouse-enter'].value;
			const modifiers = data['ot-mouse-enter'].modifiers;

			node.otMouseEnter = (event) =>
			{
				if(modifiers && modifiers.length)
				{
					if(modifiers.includes('prevent')) event.preventDefault();
					if(modifiers.includes('stop')) event.stopPropagation();
				}

				const result = onetype.Function(attribute, compile.data, false);

				if(typeof result === 'function')
				{
					result({ event });
				}
			};
		}
	});

	document.addEventListener('mouseover', function(event)
	{
		let node = event.target;

		while(node && node !== document)
		{
			if('otMouseEnter' in node && !node.__entered)
			{
				node.__entered = true;
				node.otMouseEnter(event);
				break;
			}

			node = node.parentNode;
		}
	});

	document.addEventListener('mouseout', function(event)
	{
		let node = event.target;

		while(node && node !== document)
		{
			if('otMouseEnter' in node && node.__entered)
			{
				node.__entered = false;
			}

			node = node.parentNode;
		}
	});
});
