overlays.ItemOn('add', function(item)
{
    this.cleanup = () =>
    {
        const existing = overlays.ItemGet(item.Get('id'));

        if(existing)
        {
            existing.Remove();
        }
    };

    this.render = () =>
    {
        const render = item.Get('render');

        if(render)
        {
            overlays.RenderAdd('overlay:' + item.Get('id'), function()
            {
                return render.call(this, item);
            });
        }

        return render ? overlays.Render('overlay:' + item.Get('id')) : null;
    };

    this.element = () =>
    {
        const element = document.createElement('div');
        element.className = 'dh-overlay';
        element.setAttribute('data-id', item.Get('id'));

        return element;
    };

    this.backdrop = (element) =>
    {
        const backdrop = item.Get('backdrop');

        if(backdrop)
        {
            const backdropElement = document.createElement('div');
            backdropElement.className = 'backdrop';
            backdropElement.style.opacity = backdrop;
            element.appendChild(backdropElement);
        }
    };

    this.content = (element, rendered) =>
    {
        if(rendered && rendered.Element)
        {
            rendered.Element.classList.add('content');
            element.appendChild(rendered.Element);
        }
    };

    this.position = (element, content) =>
    {
        if(!content)
        {
            return;
        }

        const target = item.Get('target') || document.body;
        const position = item.Get('position');
        const offset = item.Get('offset');
        const padding = item.Get('padding');

        let result;

        if(item.Get('flip'))
        {
            result = overlays.Fn('flip', target, content, position, offset, padding);
        }
        else
        {
            result = overlays.Fn('position', target, content, position, offset, padding);
        }

        content.style.left = result.left + 'px';
        content.style.top = result.top + 'px';
    };

    this.index = (element) =>
    {
        element.style.zIndex = overlays.Fn('index');
        item.Set('index', parseInt(element.style.zIndex));
    };

    this.callback = () =>
    {
        const onOpen = item.Get('onOpen');

        if(onOpen)
        {
            onOpen(item);
        }
    };

    // Run
    this.cleanup();

    const rendered = this.render();
    const element = this.element();

    this.backdrop(element);
    this.content(element, rendered);

    document.body.appendChild(element);

    const content = element.querySelector('.content');

    this.position(element, content);
    this.index(element);

    item.Set('element', element);

    this.callback();
});
