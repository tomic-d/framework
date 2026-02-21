const DivhuntState =
{
    StateGet(key)
    {
        const state = this.environment === 'front' ? window.__STATE__ : global.__STATE__;

        if(!state)
        {
            return key ? undefined : {};
        }

        return key ? state[key] : state;
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
    }
};

export default DivhuntState;
