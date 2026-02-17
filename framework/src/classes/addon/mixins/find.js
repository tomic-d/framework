// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonFind =
{
    Find(connection = 'primary')
    {
        const value = {addon: this, table: this.TableGet(), response: null, connection};
        this.divhunt.Middleware('addon.items.find', value);

        return value.response;
    }
};

export default AddonFind;