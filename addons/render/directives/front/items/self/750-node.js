onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-node',
		icon: 'code',
		name: 'Node Mount',
		description: 'Mount a DOM node into the element.',
		trigger: 'node',
		order: 750,
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
				let key = node.getAttribute('ot-key');

				if(!key && node.hasAttribute(':ot-key'))
				{
					key = onetype.Function(node.getAttribute(':ot-key'), compile.data, false);
				}

				result.__otExternal = { name: 'node', key: key || value, render: result.__otRender || null, data: result.__otRender ? result.__otRender.Data : null };
				node.replaceWith(result);

				return;
			}

			node.removeAttribute('ot-node');
			node.removeAttribute('ot-key');
			node.removeAttribute(':ot-key');
		}
	});
});
