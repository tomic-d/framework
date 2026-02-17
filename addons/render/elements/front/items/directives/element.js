divhunt.AddonReady('directives', (directives) =>
{
	directives.ItemAdd({
		id: 'jt-element',
		icon: 'auto_awesome',
		name: 'Element Load',
		description: 'Load and render elements using custom tag syntax. Automatically detects <e-{name}> tags and renders corresponding elements.',
		trigger: 'node',
		order: 1100,
		strict: false,
		type: '1',
		code: function(data, item, compile, node, identifier)
		{
			if (!node.tagName || !node.tagName.toLowerCase().startsWith('e-') || node.tagName.toLowerCase() === 'e-bind')
			{
				return;
			}

			const tagName = node.tagName.toLowerCase();
			const elementName = tagName.substring(2);

			const attributes = {
				wrapper: {},
				data: {}
			};

			for (let i = 0; i < node.attributes.length; i++)
			{
				const attr = node.attributes[i];

				if (attr.name.startsWith('#'))
				{
					attributes.wrapper[attr.name.substring(1)] = attr.value;
				}
				else if(attr.name.startsWith(':'))
				{
					attributes.data[attr.name.substring(1)] = divhunt.Function(attr.value, compile.data, false);
				}
				else
				{
					attributes.data[attr.name] = attr.value;
				}
			}

			const slots = {};

			if(node.hasChildNodes())
			{
				Array.from(node.childNodes).forEach(child =>
				{
					if(child.nodeType === Node.ELEMENT_NODE)
					{
						const slot = child.getAttribute('slot');

						if(slot)
						{
							child.removeAttribute('slot');
							slots[slot] = { html: child.outerHTML, data: compile.data };
						}
					}
				});
			}

			const render = divhunt.Addon('elements').Render(elementName, attributes.data, attributes.wrapper, slots);

			if(render)
			{
				node.replaceWith(render.Element);
			}
			else
			{
				node.innerText = 'Element ' + elementName + ' does not exist.';
			}
		}
	});
});
