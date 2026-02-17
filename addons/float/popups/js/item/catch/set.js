popups.ItemOn('set', function(item, key, value)
{
    if(key !== 'show')
    {
        return;
    }

    const overlays = divhunt.Addon('overlays');

    if(value)
    {
        if(item.Get('overlay'))
        {
            return;
        }

        const content = item.Get('content');
        const data = item.Get('data');

        const overlay = overlays.Item({
            id: 'popup-' + item.Get('id'),
            target: item.Get('target'),
            position: item.Get('position'),
            offset: item.Get('offset'),
            flip: item.Get('flip'),
            padding: item.Get('padding'),
            backdrop: item.Get('backdrop'),
            closeable: item.Get('closeable'),
            escape: item.Get('escape'),
            onClose: () => item.Set('show', false),
            render: function()
            {
                if(data)
                {
                    Object.assign(this, data);
                }

                if(typeof content === 'function')
                {
                    return content.call(this, item);
                }

                return content;
            }
        });

        item.Set('overlay', overlay);

        const onOpen = item.Get('onOpen');

        if(onOpen)
        {
            onOpen(item);
        }
    }
    else
    {
        const overlay = item.Get('overlay');

        if(overlay)
        {
            item.Set('overlay', null);
            overlay.Remove();

            const onClose = item.Get('onClose');

            if(onClose)
            {
                onClose(item);
            }
        }
    }
});
