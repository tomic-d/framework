tooltips.ItemOn('set', function(item, key, value)
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

        const overlay = overlays.Item({
            id: 'tooltip-' + item.Get('id'),
            target: item.Get('target'),
            position: item.Get('position'),
            offset: item.Get('offset'),
            onClose: () => item.Set('show', false),
            render: function()
            {
                this.icon = item.Get('icon');
                this.title = item.Get('title');
                this.text = item.Get('text');
                this.variant = item.Get('variant');

                return `<e-tooltip
                    :icon="icon"
                    :title="title"
                    :text="text"
                    :variant="variant">
                </e-tooltip>`;
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
