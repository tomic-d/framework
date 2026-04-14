onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-element',
		icon: 'auto_awesome',
		name: 'Element Load',
		description: 'Load and render elements using custom tag syntax. Automatically detects <e-{name}> tags and renders corresponding elements.',
		trigger: 'node',
		order: 2500,
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

			const toCamel = (name) =>
			{
				return name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
			};

			for (let i = 0; i < node.attributes.length; i++)
			{
				const attr = node.attributes[i];

				if (attr.name.startsWith('#'))
				{
					attributes.wrapper[toCamel(attr.name.substring(1))] = attr.value;
				}
				else if(attr.name.startsWith(':'))
				{
					try
					{
						attributes.data[toCamel(attr.name.substring(1))] = onetype.Function(attr.value, compile.data, false);
					}
					catch(error)
					{
						onetype.Error(400, '<:tag:> :attribute: — :reason:', {tag: tagName, attribute: attr.name, reason: error.message, expression: attr.value});
					}
				}
				else
				{
					attributes.data[toCamel(attr.name)] = attr.value;
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
							slots[slot] = { element: child, data: compile.data };
						}
					}
				});
			}

			const key = attributes.wrapper['ot-key'] || attributes.data['ot-key'] || identifier;

			delete attributes.wrapper['ot-key'];
			delete attributes.data['ot-key'];

			const render = onetype.Addon('elements').Render(elementName, attributes.data, attributes.wrapper, slots);

			if(render)
			{
				render.Element.__otExternal = {
					name: elementName,
					key,
					render,
					data: attributes.data
				};

				node.replaceWith(render.Element);
			}
			else
			{
				node.innerText = 'Element ' + elementName + ' does not exist.';
			}
		}
	});
});
