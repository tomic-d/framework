toasts.ItemOn('set', function(item, key, value)
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
            id: 'toast-' + item.Get('id'),
            position: item.Get('position'),
            padding: item.Get('padding'),
            flip: false,
            escape: true,
            onClose: () => item.Set('show', false),
            render: function()
            {
                this.type = item.Get('type');
                this.title = item.Get('title');
                this.message = item.Get('message');
                this.icon = item.Get('icon');
                this.closeable = item.Get('closeable');
                this.onclose = () => item.Set('show', false);

                return `<e-toast
                    :type="type"
                    :title="title"
                    :message="message"
                    :icon="icon"
                    :closeable="closeable"
                    :onclose="onclose">
                </e-toast>`;
            }
        });

        item.Set('overlay', overlay);

        const duration = item.Get('duration');

        if(duration > 0)
        {
            const timer = setTimeout(() => item.Set('show', false), duration);
            item.Set('timer', timer);
        }

        const onOpen = item.Get('onOpen');

        if(onOpen)
        {
            onOpen(item);
        }
    }
    else
    {
        const timer = item.Get('timer');

        if(timer)
        {
            clearTimeout(timer);
            item.Set('timer', null);
        }

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
