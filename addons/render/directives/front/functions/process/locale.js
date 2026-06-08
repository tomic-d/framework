const skip = ['id', 'class', 'style', 'href', 'src', 'action', 'method', 'type', 'name', 'value', 'for', 'role', 'tabindex', 'width', 'height', 'data', 'slot'];

directives.Fn('process.locale', function(node)
{
	if(node.nodeType === 3)
	{
		const text = node.textContent.trim();

		if(text && !text.includes('{{') && node.parentNode?.tagName !== 'I')
		{
			node.textContent = node.textContent.replace(text, onetype.LocaleGet(text));
		}

		return;
	}

	if(node.nodeType === 1)
	{
		for(let i = 0; i < node.attributes.length; i++)
		{
			const attribute = node.attributes[i];

			if(attribute.name.startsWith(':') || attribute.name.startsWith('ot-'))
			{
				continue;
			}

			if(skip.includes(attribute.name))
			{
				continue;
			}

			if(!attribute.value || !attribute.value.trim())
			{
				continue;
			}

			attribute.value = onetype.LocaleGet(attribute.value);
		}

		for(let i = 0; i < node.childNodes.length; i++)
		{
			directives.Fn('process.locale', node.childNodes[i]);
		}
	}
});
