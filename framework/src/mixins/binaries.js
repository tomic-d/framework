// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntBinaries =
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

            for(let [key, val] of Object.entries(value))
            {
                const fieldPath = path ? `${path}.${key}` : key;
                result[key] = this.BinariesInjectWalk(val, binaries, fieldPath);
            }

            return result;
        }

        return value;
    }
};

export default DivhuntBinaries;
