tooltips.ItemOn('remove', function(item)
{
    this.overlay = () =>
    {
        const overlay = item.Get('overlay');

        if(overlay)
        {
            item.Set('overlay', null);
            overlay.Remove();
        }
    };

    this.callback = () =>
    {
        const onClose = item.Get('onClose');

        if(onClose)
        {
            onClose(item);
        }
    };

    this.overlay();
    this.callback();
});
