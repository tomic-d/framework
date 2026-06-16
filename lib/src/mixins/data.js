const OneTypeData =
{
    DataValidateObject(object, name = 'parameter')
    {
        if(!object || typeof object !== 'object')
        {
            throw this.Error(400, ':name: must be a non-null object.', {name}, true);
        }

        return object;
    },

    DataValidateString(string, name = 'parameter')
    {
        if(!string || typeof string !== 'string')
        {
            throw this.Error(400, ':name: must be a non-empty string.', {name}, true);
        }

        return string;
    },

    DataDefine(data, config, strict = false, depth = 0)
    {
        if (depth > 10)
        {
            throw this.Error(400, 'Maximum nesting depth exceeded.', {}, true);
        }

        this.DataValidateObject(data, 'Data');

        config = this.DataConfig(config);

        if(strict)
        {
            for (const key of Object.keys(data))
            {
                if(!(key in config))
                {
                    throw this.Error(400, 'Unknown field ":field:".', {field: key}, true);
                }
            }
        }

        for (let [key, value] of Object.entries(config))
        {
            const had = key in data;

            try
            {
                const result = this.DataDefineOne(data[key], value, strict, depth + 1);

                if(had || result !== undefined)
                {
                    data[key] = result;
                }
            }
            catch (error)
            {
                this.DataPathError(error, key);
                throw error;
            }
        }

        return data;
    },

    DataPath(path)
    {
        let out = '';

        for(const part of path)
        {
            out += part.startsWith('[') ? part : (out ? '.' + part : part);
        }

        return out;
    },

    DataPathError(error, key)
    {
        error.path = [key].concat(error.path || []);
        error.original = error.original || error.message;
        error.message = 'Field "' + this.DataPath(error.path) + '": ' + error.original;
    },

    DataDefineOne(value, config, strict = false, depth = 0)
    {
        this.DataValidateObject(config);

        const parsed = this.DataParseConfig(config);

        if(!this.DataTypeMatch(value, parsed.type))
        {
            if(strict && value !== undefined && value !== null)
            {
                throw this.Error(400, 'Expected :type:, got :got:.', {type: parsed.type, got: Array.isArray(value) ? 'array' : typeof value}, true);
            }

            if(parsed.value !== undefined && parsed.value !== null && this.DataTypeMatch(parsed.value, parsed.type))
            {
                value = parsed.value;
            }
            else if(value === null && !parsed.required)
            {
                value = null;
            }
            else
            {
                if(parsed.required)
                {
                    const got = value === null ? 'null' : (value === undefined ? 'undefined' : (Array.isArray(value) ? 'array' : typeof value));

                    throw this.Error(400, 'Expected :type:, got :got:.', {type: parsed.type, got}, true);
                }

                value = value === null ? null : undefined;
            }
        }

        if(parsed.required && parsed.type === 'string' && value === '')
        {
            throw this.Error(400, 'Required string cannot be empty.', {}, true);
        }

        if(parsed.options && value !== null && value !== undefined)
        {
            const values = Array.isArray(value) ? value : [value];

            for(let i = 0; i < values.length; i++)
            {
                if(!parsed.options.includes(values[i]))
                {
                    throw this.Error(400, 'Invalid option ":value:". Expected: :options:.', {value: values[i], options: parsed.options.join(', ')}, true);
                }
            }
        }

        if(Array.isArray(value))
        {
            if(parsed.each)
            {
                for (let i = 0; i < value.length; i++)
                {
                    try
                    {
                        value[i] = this.DataDefineOne(value[i], parsed.each, strict, depth + 1);
                    }
                    catch (error)
                    {
                        this.DataPathError(error, '[' + i + ']');
                        throw error;
                    }
                }
            }

            value = value.filter(v => v !== null && v !== undefined);
        }
        else if(typeof value === 'object' && value !== null && value !== undefined)
        {
            if(parsed.config)
            {
                value = this.DataDefine(value, parsed.config, strict);
            }
        }

        return value;
    },

    DataTypeMatch(value, type)
    {
        return type.split('|').map(t => t.trim().toLowerCase()).some(type =>
        {
            if (type === 'any')
            {
                return true;
            }

            if (type === 'array')
            {
                return Array.isArray(value);
            }

            if (type === 'object')
            {
                return typeof value === 'object' && !Array.isArray(value) && value !== null && value !== undefined;
            }

            if (type === 'binary')
            {
                return Buffer.isBuffer(value);
            }

            return type === typeof value;
        });
    },

    DataPrimitiveValue(value, defaultValue = null)
    {
        if (value === undefined || value === null)
        {
            return this.DataCloneDefault(defaultValue);
        }

        if (typeof value !== typeof defaultValue || Array.isArray(value) !== Array.isArray(defaultValue))
        {
            return this.DataCloneDefault(defaultValue);
        }

        return value;
    },

    DataCloneDefault(value)
    {
        if (value === null || value === undefined)
        {
            return value;
        }

        if (Array.isArray(value))
        {
            return value.slice();
        }

        if (typeof value === 'object')
        {
            return { ...value };
        }

        return value;
    },

    DataConfig(config)
    {
        if(typeof config === 'string')
        {
            config = this.DataSchema(config);
        }

        this.DataValidateObject(config, 'Config');

        const result = {};

        for (let [key, data] of Object.entries(config))
        {
            try
            {
                if(key.charAt(0) === '@')
                {
                    result[key.substring(1)] = this.DataConfig(this.DataSchema(key));
                    continue;
                }

                result[key] = this.DataParseConfig(data);
            }
            catch (error)
            {
                this.DataPathError(error, key);
                throw error;
            }
        }

        return result;
    },

    DataParseConfig(config)
    {
        const parsed = {
            type: null,
            value: undefined,
            required: undefined,
            config: undefined,
            options: undefined,
            description: undefined,
            metadata: undefined,
            virtual: undefined
        };

        if(Array.isArray(config))
        {
            parsed.type = config[0];
            parsed.value = config[1];
            parsed.required = typeof config[2] === 'boolean' ? config[2] : undefined;
        }
        else if(config && typeof config === 'object')
        {
            parsed.type = config.type;
            parsed.value = config.value;
            parsed.required = typeof config.required === 'boolean' ? config.required : undefined;
            parsed.config = config.config;
            parsed.each = config.each;
            parsed.options = Array.isArray(config.options) ? config.options : undefined;
            parsed.description = typeof config.description === 'string' ? config.description : undefined;
            parsed.metadata = (config.metadata && typeof config.metadata === 'object' && !Array.isArray(config.metadata)) ? config.metadata : undefined;
            parsed.virtual = config.virtual === true ? true : undefined;
        }
        else
        {
            parsed.type = typeof config;
            parsed.value = config;
        }

        parsed.value = parsed.value === null ? undefined : parsed.value;

        if(typeof parsed.type !== 'string')
        {
            throw this.Error(400, 'Type property is missing in config.', {}, true);
        }

        parsed.type = parsed.type.toLowerCase();

        if(parsed.config)
        {
            if(typeof parsed.config === 'string')
            {
                parsed.config = this.DataSchema(parsed.config);
            }

            for (let [configKey, configValue] of Object.entries(parsed.config))
            {
                try
                {
                    parsed.config[configKey] = this.DataParseConfig(configValue);
                }
                catch (error)
                {
                    this.DataPathError(error, configKey);
                    throw error;
                }
            }
        }

        parsed.type.split('|').forEach((type) =>
        {
            if(!['number', 'string', 'boolean', 'object', 'array', 'function', 'binary', 'any'].includes(type))
            {
                throw this.Error(400, 'Invalid type ":type:". Expected: number, string, boolean, object, array, function, binary, any.', {type}, true);
            }
        })

        if(parsed.each)
        {
            if(typeof parsed.each === 'string')
            {
                parsed.each = { type: 'object', config: parsed.each };
            }

            parsed.each = this.DataParseConfig(parsed.each);
        }

        if(typeof parsed.value === 'undefined')       { delete parsed.value;       }
        if(typeof parsed.required === 'undefined')    { delete parsed.required;    }
        if(typeof parsed.config === 'undefined')      { delete parsed.config;      }
        if(typeof parsed.each === 'undefined')        { delete parsed.each;        }
        if(typeof parsed.options === 'undefined')     { delete parsed.options;     }
        if(typeof parsed.description === 'undefined') { delete parsed.description; }
        if(typeof parsed.metadata === 'undefined')    { delete parsed.metadata;    }
        if(typeof parsed.virtual === 'undefined')     { delete parsed.virtual;     }

        return parsed;
    },

    DataSchema(name, config = null)
    {
        this.DataValidateString(name, 'Schema');

        const command = this.GenerateCommand(name);

        name = command.name
        name = name.charAt(0) === '@' ? name.substring(1) : name;

        if(config === null)
        {
            if(!(name in this.data.schemas))
            {
                throw this.Error(400, 'Schema ":name:" not found.', {name}, true);
            }

            const schema = this.DataConfig(structuredClone(this.data.schemas[name]));

            const picks = command.options.filter((option) => option.name === 'pick').map((option) => option.value);

            if(picks.length)
            {
                Object.keys(schema).forEach((key) =>
                {
                    if(!picks.includes(key))
                    {
                        delete schema[key];
                    }
                });
            }

            command.options.forEach((option) =>
            {
                if(option.name === 'skip')
                {
                    delete schema[option.value];
                }
                else if(option.name === 'optional')
                {
                    Object.values(schema).forEach((value) =>
                    {
                        delete value.required;
                        delete value.value;
                    });
                }
            });

            return schema;
        }

        this.data.schemas[name] = config;
    }
};

export default OneTypeData;
