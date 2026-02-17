// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntOverrides =
{
    OverrideLog()
    {
        let start = performance.now();
        let log = console.log

        console.log = function(message, ...keys)
        {
            if(typeof message !== 'string')
            {
                return log(message, ...keys);
            }

            const now = performance.now();
            const elapsed = now - start;
            const timestamp = new Date().toISOString();
            
            if (!message.endsWith('.')) 
            {
                message = message + '.';
            }

            keys.forEach((key, index) => 
            {
                message = message.replace(':' + (index + 1), key);
            })
            
            log(`${timestamp} [+${elapsed.toFixed(2)}ms] - ${message}`);
            start = now;
        };
    },
};

export default DivhuntOverrides;