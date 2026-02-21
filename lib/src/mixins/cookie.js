const DivhuntCookie =
{
    CookieGet(name, request)
    {
        const header = this.environment === 'front' ? document.cookie : (request?.headers?.cookie || '');
        const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));

        if(!match)
        {
            return null;
        }

        return decodeURIComponent(match[1]);
    },

    CookieSet(name, value, options, response)
    {
        const parts = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];

        if(options?.path)
        {
            parts.push('Path=' + options.path);
        }

        if(options?.maxAge)
        {
            parts.push('Max-Age=' + options.maxAge);
        }

        if(options?.domain)
        {
            parts.push('Domain=' + options.domain);
        }

        if(options?.sameSite)
        {
            parts.push('SameSite=' + options.sameSite);
        }

        if(this.environment === 'front')
        {
            if(options?.secure)
            {
                parts.push('Secure');
            }

            document.cookie = parts.join('; ');
            return;
        }

        if(options?.httpOnly !== false)
        {
            parts.push('HttpOnly');
        }

        if(options?.secure !== false)
        {
            parts.push('Secure');
        }

        const existing = response.getHeader('Set-Cookie') || [];
        const cookies = Array.isArray(existing) ? existing : [existing];
        cookies.push(parts.join('; '));
        response.setHeader('Set-Cookie', cookies);
    },

    CookieClear(name, options, response)
    {
        this.CookieSet(name, '', { path: options?.path || '/', maxAge: 0 }, response);
    }
};

export default DivhuntCookie;
