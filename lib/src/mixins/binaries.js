const OneTypeBinaries =
{
    BinariesExtract(data)
    {
        const binaries = {};
        const cleaned = this.BinariesExtractWalk(data, binaries, '');
        return {data: cleaned, binaries};
    },

    BinariesInject(data, binaries)
    {
        return this.BinariesInjectWalk(data, binaries, '');
    },

    BinariesExtractWalk(value, binaries, path)
    {
        if(value === null || value === undefined)
        {
            return value;
        }

        if(Buffer.isBuffer(value))
        {
            binaries[path] = value;
            return undefined;
        }

        if(Array.isArray(value))
        {
            return value.map((item, i) =>
                this.BinariesExtractWalk(item, binaries, path ? `${path}.${i}` : `${i}`)
            );
        }

        if(typeof value === 'object')
        {
            const result = {};

            for(let [key, val] of Object.entries(value))
            {
                const fieldPath = path ? `${path}.${key}` : key;
                result[key] = this.BinariesExtractWalk(val, binaries, fieldPath);
            }

            return result;
        }

        return value;
    },

    BinariesInjectWalk(value, binaries, path)
    {
        if(binaries[path])
        {
            return binaries[path];
        }

        if(value === null || value === undefined)
        {
            return value;
        }

        if(Array.isArray(value))
        {
            return value.map((item, i) =>
                this.BinariesInjectWalk(item, binaries, path ? `${path}.${i}` : `${i}`)
            );
        }

        if(typeof value === 'object')
        {
            const result = {};
            const seen = new Set();

            for(let [key, val] of Object.entries(value))
            {
                const fieldPath = path ? `${path}.${key}` : key;
                result[key] = this.BinariesInjectWalk(val, binaries, fieldPath);
                seen.add(fieldPath);
            }

            /* Sender may attach a binary at a path that has no JSON
               placeholder (e.g. agent.proxy.data carries `data` only in
               the binaries map). Surface those entries so receivers do
               not need to know whether the sender included a placeholder. */
            const prefix = path ? `${path}.` : '';

            for(const fieldPath of Object.keys(binaries))
            {
                if(seen.has(fieldPath))
                {
                    continue;
                }

                if(!fieldPath.startsWith(prefix))
                {
                    continue;
                }

                const remainder = fieldPath.slice(prefix.length);

                if(remainder.includes('.'))
                {
                    continue;
                }

                result[remainder] = binaries[fieldPath];
            }

            return result;
        }

        return value;
    }
};

export default OneTypeBinaries;
