import OneTypeErrorClass from '../classes/error/class.js';

const OneTypeError =
{
    Error(code, message, context)
    {
        const error = new OneTypeErrorClass(code, message, context);

        this.Emit('error', error);

        return error;
    }
};

export default OneTypeError;