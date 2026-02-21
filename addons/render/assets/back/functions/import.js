import assets from '../addon.js';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');

const map =
{
    framework:  { js: 'lib', ignore: ['lib/load.js'] },
    commands:   { js: 'addons/core/commands', ignore: ['addons/core/commands/back'] },
    database:   { js: 'addons/core/database/front' },
    actions:    { js: 'addons/modules/actions/front' },
    variables:  { js: 'addons/modules/variables' },
    bugs:       { js: 'addons/modules/bugs/front' },
    events:     { js: 'addons/modules/events/front' },
    schedules:  { js: 'addons/modules/schedules/front' },
    shortcuts:  { js: 'addons/modules/shortcuts/front' },
    sources:    { js: 'addons/modules/sources/front' },
    directives: { js: 'addons/render/directives/front' },
    transforms: { js: 'addons/render/transforms/front' },
    pages:      { js: 'addons/render/pages', css: 'addons/render/pages/front' },
    elements:   { js: 'addons/render/elements/front', css: 'addons/render/elements/front' },
    float:      { js: 'addons/float', css: 'addons/float' }
};

assets.Fn('import', function(modules)
{
    for (let i = 0; i < modules.length; i++)
    {
        const config = map[modules[i]];

        if (!config) continue;

        if (config.js)
        {
            assets.Item({ type: 'js', order: i, path: resolve(root, config.js), ignore: config.ignore || [] });
        }

        if (config.css)
        {
            assets.Item({ type: 'css', order: i, path: resolve(root, config.css) });
        }
    }
});
