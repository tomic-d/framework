const OneTypeState =
{
    StateGet(key, value)
    {
        const state = this.environment === 'front' ? window.__STATE__ : global.__STATE__;

        if(!state)
        {
            return key ? value : {};
        }

        const result = key ? state[key] : state;

        if(result === undefined || result === null)
        {
            return value;
        }

        if(value !== undefined && typeof result !== typeof value)
        {
            return value;
        }

        return result;
    },

    StateSet(key, value)
    {
        const scope = this.environment === 'front' ? window : global;

        if(!scope.__STATE__)
        {
            scope.__STATE__ = {};
        }

        scope.__STATE__[key] = value;

        this.Emit('@state.change', key, value);
    }
};

export default OneTypeState;
