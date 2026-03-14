overlays.ItemOn('add', function(item)
{
	this.replace = () =>
	{
		const existing = overlays.ItemGet(item.Get('id'));

		if(existing && existing !== item)
		{
			existing.Remove();
		}
	};

	this.compile = () =>
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

	this.element = (rendered) =>
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
			rendered.Element.classList.add('content');
			element.appendChild(rendered.Element);
		}

		item.Set('element', element);
		item.Set('index', parseInt(element.style.zIndex));

		return element;
	};

	this.open = (element) =>
	{
		const callback = item.Get('onOpen');

		if(callback)
		{
			callback(item);
		}

		document.body.appendChild(element);
	};

	this.position = (element) =>
	{
		if(element.classList.contains('ot-modal'))
		{
			return;
		}

		const content = element.querySelector('.content');

		if(!content)
		{
			return;
		}

		const target = item.Get('target') || document.body;
		const position = item.Get('position');
		const offset = item.Get('offset');
		const padding = item.Get('padding');
		const method = item.Get('flip') ? 'flip' : 'position';
		const result = overlays.Fn(method, target, content, position, offset, padding);

		content.style.left = result.left + 'px';
		content.style.top = result.top + 'px';
	};

	this.track = () =>
	{
		if(!item.Get('track') || !item.Get('target'))
		{
			return;
		}

		const reposition = () => overlays.Fn('reposition', item);

		item.StoreSet('scroll', reposition);
		item.StoreSet('resize', reposition);

		window.addEventListener('scroll', reposition, true);
		window.addEventListener('resize', reposition);
	};

	this.replace();

	const rendered = this.compile();
	const element = this.element(rendered);

	this.open(element);
	this.position(element);
	this.track();
});
