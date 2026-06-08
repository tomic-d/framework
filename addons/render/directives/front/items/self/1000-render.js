onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-render',
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
				onetype.Error(400, 'Render directive requires a name attribute.');
				node.remove();
				return false;
			}

			if(item[name] && item[name].Element)
			{
				item[name].Element.__otExternal = { name: 'render', key: name };
				node.replaceWith(item[name].Element);
			}
			else
			{
				onetype.Error(400, 'Render property :name: not found or is not a render instance.', {name});
				node.remove();
			}

			return false;
		}
	});
});
