onetype.AddonReady('directives', function()
{
	directives.ItemAdd({
		id: 'ot-node',
		icon: 'code',
		name: 'Node Mount',
		description: 'Mount a DOM node into the element.',
		trigger: 'node',
		order: 50,
		strict: false,
		attributes: {
			'ot-node': ['string', null, true]
		},
		code: function(data, item, compile, node, identifier)
		{
			const value = data['ot-node'].value;

			if(!value)
			{
				return;
			}

			const result = onetype.Function(value, compile.data, false);

			if(result instanceof Node)
			{
				result.__otExternal = true;
				node.replaceWith(result);
			}

			node.removeAttribute('ot-node');
		}
	});
});
