// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonRemove =
{
    Remove(callback = true)
    {
        this.divhunt.AddonRemove(this.name, callback);
    }
};

export default AddonRemove;

