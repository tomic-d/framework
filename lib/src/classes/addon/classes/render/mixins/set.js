const RenderSet =
{
    SetData(data)
    {
        this.Data = Object.assign({ state: window.__STATE__ || {} }, data);
        return this;
    },

    SetAttributes(attributes)
    {
        this.Attributes = attributes;
        return this;
    },

    SetItem(item)
    {
        this.Item = item;
        return this;
    },

    SetSlots(slots)
    {
        this.Slots = slots;
        return this;
    },

    SetCallback(callback)
    {
        this.Callback = callback;
        return this;
    }
};

export default RenderSet;