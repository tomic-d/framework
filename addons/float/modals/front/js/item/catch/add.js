modals.ItemOn('add', (item) =>
{
    const overlays = divhunt.Addon('overlays');
    const id = item.Get('id');

    const overlay = overlays.Item({
        id: 'modal-' + id,
        backdrop: item.Get('backdrop'),
        closeable: item.Get('closeable'),
        escape: item.Get('escape'),
        render: item.Get('render'),
        onOpen: (overlay) =>
        {
            const element = overlay.Get('element');

            if(element)
            {
                element.classList.add('dh-modal');

                const content = element.querySelector('.content');

                if(content)
                {
                    content.style.left = '';
                    content.style.top = '';
                }
            }

            const onOpen = item.Get('onOpen');

            if(typeof onOpen === 'function')
            {
                onOpen(item);
            }
        },
        onClose: () =>
        {
            const onClose = item.Get('onClose');

            if(typeof onClose === 'function')
            {
                onClose(item);
            }
        }
    });

    item.Set('overlay', overlay);
});
