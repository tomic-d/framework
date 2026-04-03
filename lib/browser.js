window.onetype = new OneType();
window.$ot = onetype.$ot;

if(onetype.Base())
{
    const original = window.fetch;

    window.fetch = function(url, options)
    {
        if(typeof url === 'string' && url.startsWith('/'))
        {
            url = onetype.Base() + url;
        }

        return original.call(this, url, options);
    };
}