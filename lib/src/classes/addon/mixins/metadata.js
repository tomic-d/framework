const AddonMetadata =
{
    Metadata(key, value = undefined)
    {
        if(key === undefined)
        {
            return this.metadata;
        }

        if(value === undefined)
        {
            return this.metadata[key];
        }

        this.metadata[key] = value;

        return this;
    }
};

export default AddonMetadata;
