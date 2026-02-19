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