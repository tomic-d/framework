// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemRemove =
{
    Remove(callback = true)
    {
        this.addon.ItemRemove(this.data.id, callback);
    },
};

export default AddonItemRemove;