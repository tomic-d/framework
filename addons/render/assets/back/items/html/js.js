import onetype from "#framework/load.js";

onetype.AddonReady('html', (html) => 
{
    html.Item({
        id: 'assets-js',
        exposed: true,
        tag: 'script',
        position: 'head',
        order: 90,
        attributes: {
            src: '/assets/build.js?v=18',
            defer: null
        }
    });
});