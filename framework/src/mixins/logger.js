// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntLogger =
{
    Log(level, message, meta = {})
    {
        if(!(level in this.logger.levels))
        {
            throw new Error(`Invalid log level: '${level}'`);
        }

        meta.allowed = this.logger.levels[level] >= this.logger.levels[this.logger.level];
        meta.timestamp = new Date().toISOString();
        meta.level = level;
        meta.message = message;

        this.Emit('log', meta);

        if(meta.allowed)
        {
            console.log(meta);
        }

        return this;
    },

    LogLevel(level)
    {
        if(!(level in this.logger.levels))
        {
            throw new Error(`Invalid log level: '${level}'`);
        }

        return this;
    },

    LogError(message, meta = {}, error = null, slice = 1, throwError = false)
    {
        meta.stack = error ? (error.stack.split('\n').splice(1, slice)) : [];

        this.Log('error', message + (error ? (' / ' + error.message) : ''), meta);

        if(throwError)
        {
            throw (error ? error : new Error(message))
        }
    },

    LogWarn(message, meta = {})
    {
        return this.Log('warn', message, meta);
    },

    LogInfo(message, meta = {})
    {
        return this.Log('info', message, meta);
    },

    LogVerbose(message, meta = {})
    {
        return this.Log('verbose', message, meta);
    },

    LogDebug(message, meta = {})
    {
        return this.Log('debug', message, meta);
    },

    LogSilly(message, meta = {})
    {
        return this.Log('silly', message, meta);
    }
};

export default DivhuntLogger;
