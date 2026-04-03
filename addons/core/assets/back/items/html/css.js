import onetype from "#framework/load.js";

onetype.AddonReady('html', (html) =>
{
    console.log(onetype.Base());
    
    html.Item({
        id: 'assets-css',
        exposed: true,
        tag: 'link',
        position: 'head',
        order: 90,
        attributes: {
            rel: 'stylesheet',
            href: onetype.Base() + '/assets/build.css?v=18'
        }
    });
});