// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntData =
{
    DataValidateObject(object, name = 'parameter')
    {
        if(!object || typeof object !== 'object')
        {
            throw new Error(name + ' must be a non-null object.');
        }

        return object;
    },

    DataValidateString(string, name = 'parameter')
    {
        if(!string || typeof string !== 'string')
        {
            throw new Error(name + ' must be a non-empty string.');
        }

        return string;
    },

    DataDefine(data, config, depth = 0)
    {
        if (depth > 10)
        {
            throw new Error('Maximum nesting depth of 10 exceeded in data definition.');
        }

        this.DataValidateObject(data, 'Data');

        config = this.DataConfig(config);

        for (let [key, value] of Object.entries(config))
        {
            try
            {
                data[key] = this.DataDefineOne(data[key], value, depth + 1);
            }
            catch (error)
            {
                throw new Error(`Error in field '${key}': ${error.message}`);
            }
        }

        return data;
    },

    DataDefineOne(value, config, depth = 0)
    {
        this.DataValidateObject(config);

        try
        {
            const parsed = this.DataParseConfig(config);

            if(!this.DataTypeMatch(value, parsed.type))
            {
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
                        throw new Error('Expected ' + parsed.type + '.');
                    }

                    value = value === null ? null : undefined;
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
                            value[i] = this.DataDefineOne(value[i], parsed.each, depth + 1);
                        }
                        catch (error)
                        {
                            throw new Error(`Error at array index ${i}: ${error.message}`);
                        }
                    }
                }

                value = value.filter(v => v !== null && v !== undefined);
            }
            else if(typeof value === 'object' && value !== null && value !== undefined)
            {
                if(parsed.config)
                {
                    value = this.DataDefine(value, parsed.config);
                }
            }

            return value;
        }
        catch (error)
        {
            if (error.message.includes('Error at') || error.message.includes('Error in field'))
            {
                throw error;
            }

            throw new Error(`Data validation error: ${error.message}`);
        }
    },

    DataTypeMatch(value, type)
    {
        return type.split('|').map(t => t.trim().toLowerCase()).some(type =>
        {
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
            return defaultValue;
        }

        if (typeof value !== typeof defaultValue || Array.isArray(value) !== Array.isArray(defaultValue))
        {
            return defaultValue;
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
                throw new Error(`Error in field '${key}': ${error.message}`);
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
            description: undefined
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
        }
        else 
        {
            parsed.type = typeof config;
            parsed.value = config;
        }

        parsed.value = parsed.value === null ? undefined : parsed.value;

        if(typeof parsed.type !== 'string')
        {
            throw new Error('Type property is missing in config object.');
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
                    throw new Error(`Error in field '${configKey}': ${error.message}`);
                }
            }
        }

        parsed.type.split('|').forEach((type) =>
        {
            if(!['number', 'string', 'boolean', 'object', 'array', 'function', 'binary'].includes(type))
            {
                throw new Error('Invalid config type. Expected number, string, boolean, object, array, function or binary.');
            }
        })

        if(parsed.each) 
        { 
            parsed.each = this.DataParseConfig(parsed.each); 
        }

        if(typeof parsed.value === 'undefined')       { delete parsed.value;       }
        if(typeof parsed.required === 'undefined')    { delete parsed.required;    }
        if(typeof parsed.config === 'undefined')      { delete parsed.config;      }
        if(typeof parsed.each === 'undefined')        { delete parsed.each;        }
        if(typeof parsed.options === 'undefined')     { delete parsed.options;     }
        if(typeof parsed.description === 'undefined') { delete parsed.description; }

        return parsed;
    },

    DataSchema(name, config = null)
    {
        this.DataValidateString(name, 'Schema ');

        const command = this.GenerateCommand(name);

        name = command.name
        name = name.charAt(0) === '@' ? name.substring(1) : name;
        
        if(config === null)
        {
            if(!(name in this.data.schemas))
            {
                throw new Error('Schema ' + name + ' doesn\'t exist.');
            }

            const schema = this.DataConfig(structuredClone(this.data.schemas[name]));

            command.options.forEach((option) => 
            {
                if(option.name === 'skip')
                {
                    delete schema[option.value];
                }
                else if(option.name === 'optional')
                {
                    Object.values(schema).forEach((value) => delete value.required);
                }
            });

            return schema;
        }

        this.data.schemas[name] = config;
    }
};

export default DivhuntData;