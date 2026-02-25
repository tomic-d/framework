transforms.Fn('item.load', function(item)
{
    const loaded = transforms.StoreGet('loaded') || { js: new Set(), css: new Set() };

    transforms.StoreSet('loaded', loaded);

    const load = (tag, url) =>
    {
        const set = tag === 'script' ? loaded.js : loaded.css;

        if(set.has(url))
        {
            return Promise.resolve();
        }

        set.add(url);

        return new Promise((resolve, reject) =>
        {
            const element = document.createElement(tag);

            if(tag === 'script')
            {
                element.src = url;
                element.async = true;
            }
            else
            {
                element.rel = 'stylesheet';
                element.href = url;
            }

            element.onload = resolve;
            element.onerror = () => reject(new Error(`Failed to load: ${url}`));

            document.head.appendChild(element);
        });
    };

    const js = (item.Get('js') || []).map(url => load('script', url));
    const css = (item.Get('css') || []).map(url => load('link', url));

    return Promise.all([...js, ...css]);
});
