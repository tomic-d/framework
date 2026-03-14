class OneTypeErrorClass extends Error
{
    constructor(code, message, context)
    {
        super(message);

        this.name = 'OneTypeError';
        this.code = typeof code === 'number' ? code : 500;
        this.context = context && typeof context === 'object' ? context : {};
    }

    toJSON()
    {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context
        };
    }
}

export default OneTypeErrorClass;
