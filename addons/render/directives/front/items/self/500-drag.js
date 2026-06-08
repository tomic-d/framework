onetype.AddonReady('directives', function(directives)
{
	const register = (config) =>
	{
		directives.ItemAdd({
			id: config.id,
			trigger: 'node',
			order: 500,
			attributes: { [config.id]: ['string'] },
			code: function(data, item, compile, node)
			{
				const attribute = data[config.id].value;
				const modifiers = data[config.id].modifiers;

				if(config.draggable)
				{
					node.setAttribute('draggable', 'true');
				}

				node[config.property] = (event) =>
				{
					if(config.preventDefault)
					{
						event.preventDefault();
					}

					if(modifiers && modifiers.length)
					{
						if(modifiers.includes('prevent')) event.preventDefault();
						if(modifiers.includes('stop')) event.stopPropagation();
					}

					const result = onetype.Function(attribute, compile.data, false);

					if(typeof result === 'function')
					{
						result({ event });
					}
				};
			}
		});

		document.addEventListener(config.event, function(event)
		{
			let node = event.target;

			while(node && node !== document)
			{
				if(config.property in node)
				{
					node[config.property](event);
					break;
				}

				node = node.parentNode;
			}
		});
	};

	register({ id: 'ot-dragstart', event: 'dragstart', property: 'otDragstart', draggable: true });
	register({ id: 'ot-dragover', event: 'dragover', property: 'otDragover', preventDefault: true });
	register({ id: 'ot-dragenter', event: 'dragenter', property: 'otDragenter', preventDefault: true });
	register({ id: 'ot-dragleave', event: 'dragleave', property: 'otDragleave' });
	register({ id: 'ot-drop', event: 'drop', property: 'otDrop', preventDefault: true });
	register({ id: 'ot-dragend', event: 'dragend', property: 'otDragend' });
});
