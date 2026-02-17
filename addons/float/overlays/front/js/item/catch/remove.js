overlays.ItemOn('remove', (item) =>
{
    const element = item.Get('element');

    if(element)
    {
        element.remove();
    }

    const onClose = item.Get('onClose');

    if(typeof onClose === 'function')
    {
        onClose(item);
    }
});
