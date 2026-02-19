const AddonItemRemove =
{
    Remove(callback = true)
    {
        this.addon.ItemRemove(this.data.id, callback);
    },
};

export default AddonItemRemove;