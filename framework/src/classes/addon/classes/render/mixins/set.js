// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderSet =
{
    SetData(data)
    {
        this.Data = data;
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