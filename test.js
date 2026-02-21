import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)));

import assets from './addons/render/assets/back/load.js';
import commands from './addons/core/commands/core/load.js';
import pages from './addons/render/pages/core/load.js';
import html from './addons/render/html/load.js';
import variables from './addons/modules/variables/core/load.js';

assets.Fn('import', ['framework', 'variables', 'directives', 'commands', 'pages']);
assets.Item({ type: 'js', order: 10, path: resolve(root, 'test/front') });
assets.Item({ type: 'css', order: 10, path: resolve(root, 'test/front') });

commands.Item({
    id: 'html',
    exposed: true,
    method: 'GET',
    endpoint: '*',
    type: 'HTML',
    callback: async function(properties, resolve)
    {
        resolve(html.Fn('render'));
    }
});

console.log($dh.var('test'));

commands.Item({
    id: 'test',
    exposed: true,
    method: 'POST',
    endpoint: '/api/test',
    type: 'JSON',
    in: {
        name: ['string', 'World']
    },
    out: {
        message: ['string']
    },
    callback: async function(properties, resolve)
    {
        resolve({ message: 'Hello, ' + properties.name + '!' });
    }
});

commands.Fn('expose', 'commands:run', '/api/commands/run');

await commands.Fn('http.server', 3000, {
    onStart: () =>
    {
        console.log('test server running on http://localhost:3000');
    }
});
