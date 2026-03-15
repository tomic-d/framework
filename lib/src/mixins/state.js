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
        if(this.environment === 'front')
        {
            if(!window.__STATE__)
            {
                window.__STATE__ = {};
            }

            window.__STATE__[key] = value;
        }
        else
        {
            if(!global.__STATE__)
            {
                global.__STATE__ = {};
            }

            global.__STATE__[key] = value;
        }

        this.Emit('@state.change', key, value);
    }
};

export default OneTypeState;
