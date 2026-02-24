import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const schema =
{
    js:  { type: 'object', config: { path: ['string', null, true], exclude: ['array', []] } },
    css: { type: 'object', config: { path: ['string', null, true], exclude: ['array', []] } }
};

const OneTypeAssets =
{
    Assets(id, url, config)
    {
        if (config)
        {
            return this.AssetsSet(id, url, config);
        }

        return this.AssetsGet(id);
    },

    AssetsGet(id)
    {
        if (id) return this.assets[id] || null;

        return this.assets;
    },

    AssetsSet(id, url, config)
    {
        const base = dirname(fileURLToPath(url));
        const entry = {};

        for (const type in config)
        {
            if (!(type in schema))
            {
                throw new Error(`Assets type '${type}' is not supported. Expected: js, css.`);
            }

            const value = config[type];

            if (typeof value === 'string')
            {
                entry[type] = { path: resolve(base, value), exclude: [] };
            }
            else
            {
                const resolved = this.DataDefine(
                    { path: value.path, exclude: value.exclude },
                    schema[type].config
                );

                resolved.path = resolve(base, resolved.path);
                resolved.exclude = resolved.exclude.map(e => resolve(base, e));

                entry[type] = resolved;
            }
        }

        this.assets[id] = entry;
    }
};

export default OneTypeAssets;
