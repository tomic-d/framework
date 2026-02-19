const RenderGet =
{
    GetName()
    {
        return this.Name;
    },

    GetCallback()
    {
        return this.Callback;
    },
    
    GetAddon()
    {
        return this.Addon;
    },

    GetDivhunt()
    {
        return this.Addon.divhunt;
    },
    
    GetData()
    {
        return this.Data;
    },
    
    GetAttributes()
    {
        return this.Attributes;
    },

    GetItem()
    {
        return this.Item;
    },
    
    GetElement()
    {
        return this.Element;
    },
    
    GetNodes()
    {
        return this.Nodes;
    },

    GetReady()
    {
        return this.State.ready;
    }
}

export default RenderGet;