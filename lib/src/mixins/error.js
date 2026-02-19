import DivhuntErrorClass from '../classes/error/class.js';

const DivhuntError =
{
    Error(code, message, context)
    {
        const error = new DivhuntErrorClass(code, message, context);

        this.Emit('error', error);

        return error;
    }
};

export default DivhuntError;