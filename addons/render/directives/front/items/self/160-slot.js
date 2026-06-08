onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-slot',
		icon: 'input',
		name: 'Slot',
		description: 'Insert slot content. Supports DOM elements and render instances.',
		category: 'content',
		trigger: 'node',
		order: 160,
		tag: 'slot',
		strict: true,
		attributes: {
			'name': ['string']
		},
		code: function(data, item, compile, node, id)
		{
			const name = data['name']?.value;

			if(!name)
			{
				node.remove();
				return;
			}

			const slot = item.Slots[name];

			const merged = slot && slot.context
				? Object.assign({}, slot.context(), item.GetData())
				: null;

			if(slot && slot.Element)
			{
				slot.Element.__otExternal = { name: 'slot', key: name };
				node.replaceWith(slot.Element);
			}
			else if(slot && slot.html && merged)
			{
				const compiled = item.Compile(slot.html, merged);
				node.replaceWith(...compiled.element.childNodes);
			}
			else
			{
				node.remove();
			}
		}
	});
});