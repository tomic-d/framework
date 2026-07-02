overlays.Fn('item.open', function(item)
{
	this.methods.replace = () =>
	{
		const existing = overlays.ItemGet(item.Get('id'));

		if(existing && existing !== item)
		{
			existing.Remove();
		}
	};

	this.methods.compile = () =>
	{
		const render = item.Get('render');

		if(!render)
		{
			return null;
		}

		const name = 'overlay:' + item.Get('id');

		overlays.RenderAdd(name, function()
		{
			return render.call(this, item);
		});

		return overlays.Render(name);
	};

	this.methods.element = (rendered) =>
	{
		const element = document.createElement('div');

		element.className = 'ot-overlay';
		element.setAttribute('data-id', item.Get('id'));
		element.style.zIndex = overlays.Fn('index');

		const backdrop = item.Get('backdrop');

		if(backdrop)
		{
			const bg = document.createElement('div');
			bg.className = 'backdrop';
			bg.style.opacity = backdrop;
			element.appendChild(bg);
		}

		if(rendered?.Element)
		{
			const content = document.createElement('div');

			content.className = 'content';
			content.appendChild(rendered.Element);
			element.appendChild(content);
		}

		item.Set('element', element);
		item.Set('index', parseInt(element.style.zIndex));

		return element;
	};

	this.methods.mount = (element) =>
	{
		const callback = item.Get('onOpen');

		if(callback)
		{
			callback(item);
		}

		document.body.appendChild(element);
	};

	this.methods.position = () =>
	{
		overlays.Fn('reposition', item);
	};

	this.methods.track = (element) =>
	{
		const reposition = () => overlays.Fn('reposition', item);

		item.StoreSet('resize', reposition);
		window.addEventListener('resize', reposition);

		if(item.Get('track') && item.Get('target'))
		{
			item.StoreSet('scroll', reposition);
			window.addEventListener('scroll', reposition, true);
		}

		const content = element.querySelector('.content');

		if(content)
		{
			onetype.ObserverResize(content, reposition);
		}
	};

	this.methods.replace();

	const rendered = this.methods.compile();
	const element = this.methods.element(rendered);

	this.methods.mount(element);
	this.methods.position();
	this.methods.track(element);

	const target = item.Get('target');

	if(target)
	{
		target.__remove = () => item.Remove();
	}
});
