onetype.AddonReady('directives', function()
{
	directives.ItemAdd({
		id: 'ot-node',
		icon: 'code',
		name: 'Node Reference',
		description: 'Store a DOM node reference in render data.',
		trigger: 'node',
		order: 50,
		strict: false,
		attributes: {
			'ot-node': ['string', null, true]
		},
		code: function(data, item, compile, node, identifier)
		{
			const name = data['ot-node'].value;

			if(!name)
			{
				return;
			}

			compile.data[name] = node;

			node.removeAttribute('ot-node');
		}
	});
});
