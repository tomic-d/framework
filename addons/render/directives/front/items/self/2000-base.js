onetype.AddonReady('directives', function(directives)
{
	directives.ItemAdd({
		id: 'ot-base',
		trigger: 'after',
		order: 2000,
		code: function(data, item, compile, node)
		{
			const base = onetype.Base();

			if(!base)
			{
				return;
			}

			const walk = (parent) =>
			{
				for(let i = 0; i < parent.childNodes.length; i++)
				{
					const child = parent.childNodes[i];

					if(child.nodeType !== 1)
					{
						continue;
					}

					if(child.tagName === 'A')
					{
						const href = child.getAttribute('href');

						if(href && href.startsWith('/') && !child.__base)
						{
							child.setAttribute('href', base + href);
							child.__base = base;
						}
					}

					if(child.childNodes.length)
					{
						walk(child);
					}
				}
			};

			walk(node);
		}
	});
});
