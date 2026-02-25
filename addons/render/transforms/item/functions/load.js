transforms.Fn('item.load', function(item)
{
    const loaded = transforms.StoreGet('loaded') || {};

    transforms.StoreSet('loaded', loaded);

    this.methods.script = (url) =>
    {
        if(loaded[url])
        {
            return loaded[url];
        }

        loaded[url] = new Promise((resolve, reject) =>
        {
            const element = document.createElement('script');

            element.src = url;
            element.async = true;
            element.onload = resolve;
            element.onerror = () => reject(new Error(`Failed to load: ${url}`));

            document.head.appendChild(element);
        });

        return loaded[url];
    };

    this.methods.style = (url) =>
    {
        if(loaded[url])
        {
            return loaded[url];
        }

        loaded[url] = new Promise((resolve, reject) =>
        {
            const element = document.createElement('link');

            element.rel = 'stylesheet';
            element.href = url;
            element.onload = resolve;
            element.onerror = () => reject(new Error(`Failed to load: ${url}`));

            document.head.appendChild(element);
        });

        return loaded[url];
    };

    const js = (item.Get('js') || []).map(url => this.methods.script(url));
    const css = (item.Get('css') || []).map(url => this.methods.style(url));

    return Promise.all([...js, ...css]);
});
