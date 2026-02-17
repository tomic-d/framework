// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from "#framework/load.js";

divhunt.AddonReady('html', (html) => 
{
    html.Item({
        id: 'assets-css',
        exposed: true,
        tag: 'link',
        position: 'head',
        order: 90,
        attributes: {
            rel: 'stylesheet',
            href: '/assets/build.css?v=18'
        }
    });
});