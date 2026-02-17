modals.ItemOn('remove', (item) =>
{
    const overlay = item.Get('overlay');

    if(overlay)
    {
        overlay.Remove();
    }
});
