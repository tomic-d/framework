// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntGenerate =
{
    GenerateHash(name)
    {
        let hash = 0;

        for (let i = 0; i < name.length; i++)
        {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash).toString(16);
    },

    GenerateUID()
    {
        return Math.random().toString(36).slice(2, 11);
    },

    GenerateString(length = 10, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    {
        let result = '';
        const charsetLength = charset.length;

        for (let i = 0; i < length; i++)
        {
            result += charset.charAt(Math.floor(Math.random() * charsetLength));
        }

        return result;
    },

    GenerateTID()
    {
        let timestamp = Date.now();
        let uniquePart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        return parseInt(`${timestamp}${uniquePart}`);
    },

    GenerateCommand(string)
    {
        const segments = string.trim().toLowerCase().split(' ').filter(segment => segment !== '');
        
        if(!segments.length)
        {
            return { name: '', options: [] };
        }
        
        const [name, ...parameters] = segments;
        
        const options = parameters.filter(parameter => parameter.startsWith('--')).map(parameter => 
        {
            const option = parameter.substring(2);
            
            if (option.includes('='))
            {
                const [identifier, content] = option.split('=');

                return { name: identifier, value: content };
            }
            
            return { name: option, value: null };
        });
    
        return { name, options };
    }
};

export default DivhuntGenerate;