const AddonItemFunctions =
{
    Fn(name, ...data)
    {
        return this.addon.FnRun('item.' + name, this, ...data);
    }
};

export default AddonItemFunctions;
