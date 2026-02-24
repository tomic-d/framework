import assets from '../addon.js';
import onetype from '#framework/load.js';

assets.Fn('import', function(modules)
{

        console.log(onetype.AssetsGet());

    for (let i = 0; i < modules.length; i++)
    {
        const entry = modules[i];
        const registered = onetype.AssetsGet(entry);


        if (registered)
        {
            if (registered.js)
            {
                assets.Item({ type: 'js', order: i, path: registered.js.path, ignore: registered.js.exclude || [] });
            }

            if (registered.css)
            {
                assets.Item({ type: 'css', order: i, path: registered.css.path, ignore: registered.css.exclude || [] });
            }
        }
    }
});
