class OneTypeErrorClass extends Error
{
    constructor(code, message, context)
    {
        super(message);

        this.name = 'OneTypeError';
        this.code = typeof code === 'number' ? code : 500;
        this.context = context && typeof context === 'object' ? context : {};
    }
}

export default OneTypeErrorClass;
