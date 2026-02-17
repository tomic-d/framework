// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonItemFunctions =
{
    Fn(name, ...data)
    {
        return this.addon.FnRun('item.' + name, this, ...data);
    }
};

export default AddonItemFunctions;
