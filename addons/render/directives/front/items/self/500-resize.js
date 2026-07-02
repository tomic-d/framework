onetype.AddonReady('directives', function(directives)
{
	const zone = 6;
	const cursor = { left: 'col-resize', right: 'col-resize', top: 'row-resize', bottom: 'row-resize' };

	let active = null;
	let hovered = null;

	const hit = (node, edge, event) =>
	{
		const box = node.getBoundingClientRect();

		if(edge === 'left')   return event.clientX - box.left <= zone;
		if(edge === 'right')  return box.right - event.clientX <= zone;
		if(edge === 'top')    return event.clientY - box.top <= zone;
		if(edge === 'bottom') return box.bottom - event.clientY <= zone;

		return false;
	};

	const find = (event) =>
	{
		let node = event.target;

		while(node && node !== document)
		{
			if(node.otResizeConfig)
			{
				const edge = node.otResizeConfig.edge.find((edge) => hit(node, edge, event));

				return edge ? { node, config: node.otResizeConfig, edge } : null;
			}

			node = node.parentNode;
		}

		return null;
	};

	document.addEventListener('mousedown', function(event)
	{
		const match = find(event);

		if(!match)
		{
			return;
		}

		event.preventDefault();

		const box = match.node.getBoundingClientRect();

		active = { ...match, x: event.clientX, y: event.clientY, width: box.width, height: box.height };

		document.body.style.cursor = cursor[active.edge];
		document.body.style.userSelect = 'none';
		active.node.classList.add('ot-resize-move');
	});

	document.addEventListener('mousemove', function(event)
	{
		if(!active)
		{
			const match = find(event);

			document.body.style.cursor = match ? cursor[match.edge] : '';

			if(hovered && hovered !== match?.node)
			{
				hovered.classList.remove('ot-resize-hover');
				hovered = null;
			}

			if(match && hovered !== match.node)
			{
				hovered = match.node;
				hovered.classList.add('ot-resize-hover');
			}

			return;
		}

		const { node, config, edge } = active;

		const width = Math.min(config.max, Math.max(config.min, edge === 'left' ? active.width - (event.clientX - active.x) : active.width + (event.clientX - active.x)));
		const height = Math.min(config.max, Math.max(config.min, edge === 'top' ? active.height - (event.clientY - active.y) : active.height + (event.clientY - active.y)));

		if(edge === 'left' || edge === 'right') node.style.width = width + 'px';
		if(edge === 'top' || edge === 'bottom') node.style.height = height + 'px';

		config.onResizing && config.onResizing({ event, node, edge, width: node.offsetWidth, height: node.offsetHeight });
	});

	document.addEventListener('mouseup', function(event)
	{
		if(!active)
		{
			return;
		}

		const { node, config, edge } = active;

		document.body.style.cursor = '';
		document.body.style.userSelect = '';
		node.classList.remove('ot-resize-move');

		config.onResize && config.onResize({ event, node, edge, width: node.offsetWidth, height: node.offsetHeight });

		active = null;
	});

	directives.ItemAdd({
		id: 'ot-resize',
		icon: 'drag_handle',
		name: 'Resize',
		description: 'Makes an element resizable by dragging one or more of its edges. Calls onResizing live while dragging and onResize once on release. Purely mechanical, callers own persistence.',
		trigger: 'node',
		order: 500,
		attributes: {
			'ot-resize': {
				type: 'object',
				config: {
					edge: {
						type: 'array|string',
						required: true,
						each: { type: 'string', options: ['left', 'right', 'top', 'bottom'] }
					},
					min: { type: 'number', value: 0 },
					max: { type: 'number', value: Infinity },
					width: { type: 'number' },
					height: { type: 'number' },
					onResizing: { type: 'function' },
					onResize: { type: 'function' }
				}
			}
		},
		code: function(data, item, compile, node)
		{
			const config = data['ot-resize'].value;

			config.edge = Array.isArray(config.edge) ? config.edge : [config.edge];

			node.otResizeConfig = config;

			if(config.width) node.style.width = config.width + 'px';
			if(config.height) node.style.height = config.height + 'px';
		}
	});
});
