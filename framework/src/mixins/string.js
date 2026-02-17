// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntString =
{
    StringSanitize(input)
    {
        const string = typeof input !== 'string' ? JSON.stringify(input) : input;

        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return string.replace(/[&<>"']/g, char => htmlEntities[char]);
    },

    StringHasTemplateKey(template, key)
    {
        if (typeof template !== 'string' || typeof key !== 'string')
        {
            return false;
        }

        const regex = /\{\{\s*([^}]+)\s*\}\}/g;

        const keyPattern = new RegExp(`(^|[^\\w.])${key.replace(/\./g, '\\.')}($|[^\\w])`);

        let match;

        while ((match = regex.exec(template)) !== null)
        {
            const expression = match[1].trim();

            if (keyPattern.test(expression))
            {
                return true;
            }
        }

        return false;
    },

    StringCompileTemplate(template, data)
    {
        if (typeof template !== 'string')
        {
            return '';
        }

        if(!data || typeof data !== 'object')
        {
            return template;
        }

        return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) =>
        {
            try
            {
                const keys = key.trim().split('.');
                let value = data;
                let depth = 0;
                const MAX_DEPTH = 5;

                for (const k of keys)
                {
                    if (value === undefined || value === null || depth > MAX_DEPTH)
                    {
                        return match;
                    }

                    value = value[k];
                    depth++;
                }

                return value !== undefined && value !== null ? (value + '') : match;
            }
            catch(error)
            {
                return match;
            }
        });
    },

    StringExtractUnit(string, unit = 'px')
    {
        const strValue = (string + '');
        const match = strValue.match(/^(\d+)(%|px|em|rem|vh|vw|pt)?$/);

        if (match)
        {
            return {
                value: parseInt(match[1], 10),
                unit: match[2] || unit
            };
        }

        return {
            value: 0,
            unit: unit
        };
    },

    StringTruncate(string, length = 100, append = '...')
    {
        if (typeof string !== 'string')
        {
            string = (string + '');
        }

        if (string.length <= length)
        {
            return string;
        }

        return string.slice(0, length - append.length) + append;
    },

    StringCapitalize(string)
    {
        if (typeof string !== 'string' || !string.length)
        {
            return '';
        }

        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    StringToCamelCase(string)
    {
        if (typeof string !== 'string')
        {
            return '';
        }

        return string.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length).map((word, index) =>
        {
            return index === 0 ? word.toLowerCase() : this.StringCapitalize(word.toLowerCase());
        })
        .join('');
    },

    StringStripHtml(html)
    {
        if (typeof html !== 'string')
        {
            return '';
        }

        return html.replace(/<style[^>]*>.*?<\/style>/gs, '')
            .replace(/<script[^>]*>.*?<\/script>/gs, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
    },

    StringSlugify(string)
    {
        if (typeof string !== 'string')
        {
            return '';
        }

        return string.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    StringFormatNumber(number, decimals = 2, decPoint = '.', thousandsSep = ',')
    {
        if (isNaN(number))
        {
            return '0';
        }

        const string = parseFloat(number).toFixed(decimals);
        const parts = string.split('.');

        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

        return parts.join(decPoint);
    }
};

export default DivhuntString;
