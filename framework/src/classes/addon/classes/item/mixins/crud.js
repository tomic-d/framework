// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemCrud =
{
    async Create(connection = 'primary')
    {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.create', value);

        return value.response;
    },

    async Update(connection = 'primary')
    {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.update', value);

        return value.response;
    },

    async Delete(connection = 'primary')
    {
        const value = {item: this, table: this.addon.TableGet(), response: null, connection};
        await this.addon.divhunt.Middleware('item.crud.delete', value);

        return value.response;
    }
};

export default AddonItemCrud;