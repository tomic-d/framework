document.addEventListener('keydown', (event) =>
{
    if(event.key !== 'Escape')
    {
        return;
    }

    const items = Object.values(overlays.Items()).sort((a, b) => b.Get('index') - a.Get('index'));

    for(const item of items)
    {
        if(item.Get('escape'))
        {
            item.Remove();
            break;
        }
    }
});
