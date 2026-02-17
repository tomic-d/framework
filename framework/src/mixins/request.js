// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntRequest = {
    Request(name, value)
    {
        name = name.toLowerCase();

        const data = {value};

        this.Emit('request.' + name, data);

        if(typeof data !== 'object' || !('value' in data) || typeof data.value !== typeof value)
        {
            return value;
        }

        return data.value;
    },

    RequestCatch(name, callback)
    {
        name = name.toLowerCase();

        this.EmitOn('request.' + name, callback);
    }
};

export default DivhuntRequest;
