// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import divhunt from "#framework/load.js";
import assets from "#assets/addon.js";

divhunt.AddonReady('commands', (commands) => 
{
    commands.Item({
        id: 'assets:js',
        exposed: true,
        method: 'GET',
        endpoint: '/assets/build.js',
        type: 'JS',
        callback: async function(properties, resolve)
        {
            resolve(await assets.Fn('js', {http: this.http}));
        }
    });
});