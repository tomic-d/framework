import { json } from 'node:stream/consumers';
import serversHTTP from '#servers/http/addon.js';
import Busboy from 'busboy';

serversHTTP.Fn('extract.data', async function(request)
{
    this.methods = {};

    this.methods.extractQueryParams = (request) =>
    {
        const properties = {};
        const url = new URL(request.url, `https://${request.headers.host}`);

        url.searchParams.forEach((value, key) =>
        {
            properties[key] = value;
        });

        return properties;
    };

    this.methods.extractMultipart = async (request) =>
    {
        const properties = {};

        await new Promise((resolve, reject) =>
        {
            const busboy = Busboy({headers: request.headers});

            busboy.on('field', (name, value) =>
            {
                properties[name] = value;
            });

            busboy.on('file', (name, stream) =>
            {
                const chunks = [];

                stream.on('data', (chunk) =>
                {
                    chunks.push(chunk);
                });

                stream.on('end', () =>
                {
                    properties[name] = Buffer.concat(chunks);
                });
            });

            busboy.on('finish', resolve);
            busboy.on('error', reject);

            request.pipe(busboy);
        });

        return properties;
    };

    this.methods.extractJson = async (request) =>
    {
        try
        {
            const body = await json(request);

            if (body && typeof body === 'object')
            {
                return body;
            }
        }
        catch(error)
        {
            // Invalid JSON, skip body parsing
        }

        return {};
    };

    this.methods.convertNumber = (value) =>
    {
        const num = Number(value);
        return isNaN(num) ? null : num;
    };

    this.methods.convertString = (value) =>
    {
        return String(value);
    };

    this.methods.convertBoolean = (value) =>
    {
        if (['true', '1', true, 1].includes(value))
        {
            return true;
        }

        if (['false', '0', false, 0].includes(value))
        {
            return false;
        }

        return null;
    };

    this.methods.convertArray = (value) =>
    {
        if (Array.isArray(value))
        {
            return value;
        }

        if (typeof value === 'string')
        {
            try
            {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : value.split(',').map(item => item.trim()).filter(Boolean);
            }
            catch
            {
                return value.split(',').map(item => item.trim()).filter(Boolean);
            }
        }

        return null;
    };

    this.methods.convertObject = (value) =>
    {
        if (typeof value === 'object' && !Array.isArray(value))
        {
            return value;
        }

        if (typeof value === 'string')
        {
            try
            {
                const parsed = JSON.parse(value);
                return (typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : null;
            }
            catch
            {
                return null;
            }
        }

        return null;
    };

    this.methods.convertBinary = (value) =>
    {
        if (Buffer.isBuffer(value))
        {
            return value;
        }

        if (typeof value === 'string')
        {
            try
            {
                return Buffer.from(value, 'base64');
            }
            catch
            {
                return null;
            }
        }

        return null;
    };

    this.methods.convertValue = (value, hint, base) =>
    {
        if (!hint)
        {
            return {[base]: value};
        }

        if (value === null || value === undefined || value === '')
        {
            return {[base]: null};
        }

        const converters =
        {
            number: this.methods.convertNumber,
            string: this.methods.convertString,
            boolean: this.methods.convertBoolean,
            array: this.methods.convertArray,
            object: this.methods.convertObject,
            binary: this.methods.convertBinary
        };

        const converter = converters[hint.toLowerCase()];

        if (converter)
        {
            return {[base]: converter(value)};
        }

        return {[base]: value};
    };

    const properties = this.methods.extractQueryParams(request);

    if (request.method !== 'GET')
    {
        const contentType = request.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data'))
        {
            const multipart = await this.methods.extractMultipart(request);
            Object.assign(properties, multipart);
        }
        else
        {
            const body = await this.methods.extractJson(request);
            Object.assign(properties, body);
        }
    }

    const result = {};

    for (const [key, value] of Object.entries(properties))
    {
        const [base, hint] = key.split(':');
        const converted = this.methods.convertValue(value, hint, hint ? base : key);
        Object.assign(result, converted);
    }

    return result;
});