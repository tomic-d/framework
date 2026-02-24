transforms.Fn('load.assets', async function(item)
{
    const loaded = transforms.loaded = transforms.loaded || {js: new Set(), css: new Set()};

    const js = item.Get('js') || [];
    const css = item.Get('css') || [];

    const jsPromises = js.map(url =>
    {
        if (loaded.js.has(url))
        {
            return Promise.resolve();
        }

        loaded.js.add(url);

        return new Promise((resolve, reject) =>
        {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    });

    const cssPromises = css.map(url =>
    {
        if (loaded.css.has(url))
        {
            return Promise.resolve();
        }

        loaded.css.add(url);

        return new Promise((resolve, reject) =>
        {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
            document.head.appendChild(link);
        });
    });

    await Promise.all([...jsPromises, ...cssPromises]);
});