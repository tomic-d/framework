import onetype from "#framework/load.js";

onetype.AddonReady('html', (html) =>
{
    html.Item({
        id: 'assets-css',
        exposed: true,
        tag: 'link',
        position: 'head',
        order: 90,
        attributes: {
            rel: 'stylesheet',
            href: onetype.StateGet('base', '') + '/assets/build.css?v=18'
        }
    });
});