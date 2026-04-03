onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-mouse-leave',
		trigger: 'node',
		order: 500,
		attributes: { 'ot-mouse-leave': ['string'] },
		code: function(data, item, compile, node)
		{
			const attribute = data['ot-mouse-leave'].value;
			const modifiers = data['ot-mouse-leave'].modifiers;

			node.otMouseLeave = (event) =>
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

	document.addEventListener('mouseout', function(event)
	{
		let node = event.target;

		while(node && node !== document)
		{
			if('otMouseLeave' in node && !node.__left)
			{
				node.__left = true;
				node.otMouseLeave(event);
				break;
			}

			node = node.parentNode;
		}
	});

	document.addEventListener('mouseover', function(event)
	{
		let node = event.target;

		while(node && node !== document)
		{
			if('otMouseLeave' in node && node.__left)
			{
				node.__left = false;
			}

			node = node.parentNode;
		}
	});
});
