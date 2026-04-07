transforms.Fn('item.run', function(item, node, data = null)
{
	if(data === null)
	{
		data = transforms.Fn('data', item.Get('config'), node);
	}

	item.Fn('load').then(() =>
	{
		if(!document.contains(node))
		{
			return;
		}

		node.setAttribute('ot-init', '');

		const context = {
			scroll: { progress: 0, direction: 'down', speed: 0, top: 0, bottom: 0, visible: false },
			hover: { active: false, x: 0, y: 0, offset: 0 },
			click: { x: 0, y: 0 }
		};

		item.Get('code').call(context, data, node, item);

		if(item.Get('visible'))
		{
			onetype.ObserverVisible(node, () =>
			{
				item.Get('visible').call(context, data, node, item);
			});
		}

		if(item.Get('resize'))
		{
			onetype.ObserverResize(node, () =>
			{
				item.Get('resize').call(context, data, node, item);
			});
		}

		if(item.Get('scroll'))
		{
			onetype.ObserverScroll(node, (scroll) =>
			{
				context.scroll = scroll;
				item.Get('scroll').call(context, data, node, item);
			});
		}

		if(item.Get('hover'))
		{
			onetype.ObserverHover(node, (hover) =>
			{
				context.hover = hover;
				item.Get('hover').call(context, data, node, item);
			}, context.hover.offset);
		}

		if(item.Get('click'))
		{
			onetype.ObserverClick(node, (click) =>
			{
				context.click = click;
				item.Get('click').call(context, data, node, item);
			});
		}

		const listener = onetype.EmitOn('@dom.remove', (removed) =>
		{
			if(removed !== node && document.contains(node))
			{
				return;
			}

			onetype.EmitOff('@dom.remove', listener);
			onetype.ObserverUnvisible(node);
			onetype.ObserverUnresize(node);
			onetype.ObserverUnscroll(node);
			onetype.ObserverUnhover(node);
			onetype.ObserverUnclick(node);

			if(item.Get('destroy'))
			{
				item.Get('destroy').call(context, data, node, item);
			}
		});

		requestAnimationFrame(() =>
		{
			node.removeAttribute('ot');
			node.removeAttribute('ot-init');
		});
	});
});
