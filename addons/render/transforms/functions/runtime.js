transforms.Fn('runtime', function()
{
    this.methods.process = (node) =>
    {
        const id = node.getAttribute('ot');

        if(!id)
        {
            return;
        }

        node.removeAttribute('ot');
        transforms.Fn('run', id, node);
    };

    this.methods.scan = () =>
    {
        document.querySelectorAll('[ot]').forEach(node =>
        {
            this.methods.process(node);
        });
    };

    this.methods.observe = () =>
    {
        new MutationObserver((mutations) =>
        {
            for(const mutation of mutations)
            {
                for(const node of mutation.addedNodes)
                {
                    if(node.nodeType !== 1)
                    {
                        continue;
                    }

                    if(node.hasAttribute('ot'))
                    {
                        this.methods.process(node);
                    }

                    node.querySelectorAll('[ot]').forEach(child =>
                    {
                        this.methods.process(child);
                    });
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    };

    if(document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', () =>
        {
            this.methods.scan();
            this.methods.observe();
        });
    }
    else
    {
        this.methods.scan();
        this.methods.observe();
    }
});
