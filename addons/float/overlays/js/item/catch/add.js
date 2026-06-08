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
		const reposition = () => overlays.Fn('reposition', item);

		/* Resize always repositions — viewport floats (modal, drawer) and tracked popups alike. */
		item.StoreSet('resize', reposition);
		window.addEventListener('resize', reposition);

		/* Scroll only repositions popups anchored to a target that scrolls with the page. */
		if(item.Get('track') && item.Get('target'))
		{
			item.StoreSet('scroll', reposition);
			window.addEventListener('scroll', reposition, true);
		}
	};

	this.replace();

	const rendered = this.compile();
	const element = this.element(rendered);

	this.open(element);
	this.position(element);
	this.track();

	const target = item.Get('target');

	if(target)
	{
		target.__remove = () => item.Remove();
	}
});
