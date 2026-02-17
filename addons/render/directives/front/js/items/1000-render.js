directives.ItemAdd({
	id: 'dh-render',
	icon: 'code',
	name: 'Render',
	description: 'Render components or elements into the DOM. Use <render name="property"> to inject render instances from the parent context.',
    category: 'content',
	trigger: 'node',
	order: 1000,
	tag: 'render',
	attributes: {
		'name': ['string']
	},
	code: function(data, item, compile, node)
	{
		const name = data['name'].value;

		if(!name)
		{
			console.error('Render directive requires a name attribute');
			node.remove();
			return false;
		}

		if(item[name] && item[name].Element)
		{
			node.replaceWith(item[name].Element);
		}
		else
		{
			console.warn(`Render property "${name}" not found or is not a render instance`);
			node.remove();
		}

		return false;
	}
});
