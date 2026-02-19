class DivhuntError extends Error
{
    constructor(code, message, context)
    {
        super(message);

        this.name = 'DivhuntError';
        this.code = typeof code === 'number' ? code : 500;
        this.context = context && typeof context === 'object' ? context : {};
    }
}

export default DivhuntError;
