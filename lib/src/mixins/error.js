import OneTypeErrorClass from '../classes/error/class.js';

const OneTypeError =
{
    Error(code, message, context, silent = false)
    {
        if(context && typeof context === 'object')
        {
            for(const [key, value] of Object.entries(context))
            {
                message = message.replace(':' + key + ':', value);
            }
        }

        const error = new OneTypeErrorClass(code, message, context);

        if(!this.emitting)
        {
            this.emitting = true;
            this.Emit(silent ? '@error.silent' : '@error', error);
            this.emitting = false;
        }

        return error;
    }
};

export default OneTypeError;