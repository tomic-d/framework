// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntFunction =
{
    FunctionCache: new Map(),

    Function(expression, data = {}, safe = true)
    {
        if (!this.FunctionExpressionValid(expression, safe))
        {
            return undefined;
        }

        try
        {
            const keys = Object.keys(data);
            const cacheKey = keys.length > 0 ? expression + ':' + keys.join(',') : expression;

            let evaluator = this.FunctionCache.get(cacheKey);

            if (!evaluator)
            {
                const FunctionConstructor = Function;
                evaluator = new FunctionConstructor(...keys, `return ${expression};`);
                this.FunctionCache.set(cacheKey, evaluator);
            }

            return keys.length > 0 ? evaluator(...Object.values(data)) : evaluator();
        }
        catch (error)
        {
            return undefined;
        }
    },

    FunctionExpressionValid(expression, safe = true)
    {
        if (expression.includes(';') ||
            expression.includes('`') ||
            expression.includes('return '))
        {
            return false;
        }

        if (!safe)
        {
            return true;
        }

        if (expression.includes('=>'))
        {
            return false;
        }

        const safePattern = /^[a-zA-Z0-9_\[\]\.\'"+-\/*%<>=!&|\s()?,:\d:]*$/;

        if (!safePattern.test(expression))
        {
            return false;
        }
        
        const dangerousKeywords = [
            'eval', 'Function', 'setTimeout', 'setInterval', 'execScript',
            'constructor', 'prototype', '__proto__', 'global', 'process',
            'require', 'import', 'export', 'module', 'window', 'document',
            'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest',
            '__dirname', '__filename', 'Buffer', 'Promise', 'arguments',
            'callee', 'caller', 'debugger', 'new', 'this', 'delete',
            'bind', 'apply', 'call', 'Reflect', 'Proxy', 'revoke'
        ];

        const withoutQuotes = expression.replace(/'[^']*'|"[^"]*"/g, '');

        return !dangerousKeywords.some(keyword =>
        {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(withoutQuotes);
        });
    }
};

export default DivhuntFunction;