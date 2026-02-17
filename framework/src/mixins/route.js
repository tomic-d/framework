// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntRoute =
{
    RouteNormalize(pathname)
    {
        if (!pathname || pathname === '/')
        {
            return '/';
        }

        let normalized = pathname.toLowerCase();

        if (normalized.endsWith('/') && normalized.length > 1)
        {
            normalized = normalized.slice(0, -1);
        }

        if (!normalized.startsWith('/'))
        {
            normalized = '/' + normalized;
        }

        return normalized;
    },

    RouteMatch(pattern, pathname)
    {
        const normalized = this.RouteNormalize(pattern);
        const path = this.RouteNormalize(pathname);

        if (normalized === path)
        {
            return { match: true, params: {} };
        }

        if (normalized.includes('*'))
        {
            const segments = normalized.split('/');
            const parts = path.split('/');

            if (segments[segments.length - 1] === '*')
            {
                if (parts.length < segments.length - 1)
                {
                    return { match: false, params: {} };
                }

                for (let i = 0; i < segments.length - 1; i++)
                {
                    if (segments[i] !== parts[i])
                    {
                        return { match: false, params: {} };
                    }
                }

                return { match: true, params: {} };
            }
        }

        if (normalized.includes(':') || normalized.includes('*'))
        {
            const segments = normalized.split('/');
            const parts = path.split('/');

            if (segments.length !== parts.length)
            {
                return { match: false, params: {} };
            }

            let matches = true;
            const params = {};

            for (let i = 0; i < segments.length; i++)
            {
                if (segments[i] === '*')
                {
                    continue;
                }
                else if (segments[i].startsWith(':'))
                {
                    const name = segments[i].substring(1);
                    params[name] = parts[i];
                }
                else if (segments[i] !== parts[i])
                {
                    matches = false;
                    break;
                }
            }

            if (matches)
            {
                return { match: true, params };
            }
        }

        return { match: false, params: {} };
    },

    RouteParams(pattern, pathname)
    {
        const result = this.RouteMatch(pattern, pathname);
        return result.match ? result.params : null;
    },

    RouteBuild(pattern, params = {})
    {
        let route = pattern;

        for (const [key, value] of Object.entries(params))
        {
            route = route.replace(':' + key, value);
        }

        return this.RouteNormalize(route);
    },

    RouteQuery(search)
    {
        const query = search || (typeof window !== 'undefined' ? window.location.search : '');

        if (!query)
        {
            return {};
        }

        const params = {};
        const cleaned = query.startsWith('?') ? query.substring(1) : query;

        if (!cleaned)
        {
            return {};
        }

        cleaned.split('&').forEach(pair =>
        {
            const [key, value] = pair.split('=');

            if (key)
            {
                params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
            }
        });

        return params;
    },

    RouteHash()
    {
        if (typeof window === 'undefined')
        {
            return '';
        }

        const hash = window.location.hash;
        return hash ? hash.substring(1) : '';
    },

    RouteCurrent()
    {
        if (typeof window === 'undefined')
        {
            return '/';
        }

        return this.RouteNormalize(window.location.pathname);
    },

    RouteNavigate(pathname, state = {})
    {
        if (typeof window === 'undefined')
        {
            return;
        }

        const normalized = this.RouteNormalize(pathname);

        if (window.history && window.history.pushState)
        {
            window.history.pushState(state, '', normalized);
            window.dispatchEvent(new PopStateEvent('popstate', { state }));
        }
        else
        {
            window.location.pathname = normalized;
        }
    }
};

export default DivhuntRoute;
