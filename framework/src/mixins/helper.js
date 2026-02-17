// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntHelper =
{
    HelperDebounce(callback, delay = 300)
    {
        let timer;
        
        return (...args) =>
        {
            clearTimeout(timer);
            timer = setTimeout(() => callback(...args), delay);
        };
    },
    
    HelperThrottle(callback, delay = 300)
    {
        let waiting = false;
        let lastArgs;
        
        const timeoutFunc = () =>
        {
            if(lastArgs)
            {
                callback(...lastArgs);
                lastArgs = null;
                setTimeout(timeoutFunc, delay);
            }
            else
            {
                waiting = false;
            }
        };
        
        return (...args) =>
        {
            if(waiting)
            {
                lastArgs = args;
                return;
            }
            
            callback(...args);
            waiting = true;
            setTimeout(timeoutFunc, delay);
        };
    },
    
    HelperSleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    HelperRetry(fn, retries = 3, delay = 1000)
    {
        return new Promise((resolve, reject) =>
        {
            const attempt = async (remaining) =>
            {
                try
                {
                    const result = await fn();
                    resolve(result);
                }
                catch(error)
                {
                    if(remaining <= 0)
                    {
                        reject(error);
                        return;
                    }
                    
                    await this.HelperSleep(delay);
                    attempt(remaining - 1);
                }
            };
            
            attempt(retries);
        });
    },
    
    HelperMemoize(fn)
    {
        const cache = new Map();
        
        return (...args) =>
        {
            const key = JSON.stringify(args);
            
            if(cache.has(key))
            {
                return cache.get(key);
            }
            
            const result = fn(...args);
            cache.set(key, result);
            
            return result;
        };
    },
    
    HelperPipe(...fns)
    {
        return (value) => fns.reduce((v, fn) => fn(v), value);
    },
    
    HelperCompose(...fns)
    {
        return (value) => fns.reduceRight((v, fn) => fn(v), value);
    },
    
    HelperPick(obj, keys)
    {
        return keys.reduce((result, key) =>
        {
            if(key in obj)
            {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },
    
    HelperOmit(obj, keys)
    {
        const keysSet = new Set(keys);
        
        return Object.entries(obj).reduce((result, [key, value]) =>
        {
            if(!keysSet.has(key))
            {
                result[key] = value;
            }
            return result;
        }, {});
    },
    
    HelperDeepClone(obj)
    {
        if(obj === null || typeof obj !== 'object')
        {
            return obj;
        }
        
        if(obj instanceof Date)
        {
            return new Date(obj);
        }
        
        if(obj instanceof Array)
        {
            return obj.map(item => this.HelperDeepClone(item));
        }
        
        if(obj instanceof Object)
        {
            const clone = {};
            
            for(const key in obj)
            {
                if(obj.hasOwnProperty(key))
                {
                    clone[key] = this.HelperDeepClone(obj[key]);
                }
            }
            
            return clone;
        }
    },
    
    HelperDeepMerge(target, ...sources)
    {
        if(!sources.length) return target;
        
        const source = sources.shift();
        
        if(this.HelperIsObject(target) && this.HelperIsObject(source))
        {
            for(const key in source)
            {
                if(this.HelperIsObject(source[key]))
                {
                    if(!target[key]) Object.assign(target, { [key]: {} });
                    this.HelperDeepMerge(target[key], source[key]);
                }
                else
                {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.HelperDeepMerge(target, ...sources);
    },
    
    HelperIsObject(item)
    {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    
    HelperIsEmpty(value)
    {
        if(value == null) return true;
        if(typeof value === 'boolean') return false;
        if(typeof value === 'number') return false;
        if(value instanceof Date) return false;
        if(value instanceof Error) return false;
        if(Array.isArray(value)) return value.length === 0;
        if(typeof value === 'string') return value.length === 0;
        if(value instanceof Map || value instanceof Set) return value.size === 0;
        if(typeof value === 'object') return Object.keys(value).length === 0;
        
        return false;
    },
    
    HelperGroupBy(array, key)
    {
        return array.reduce((groups, item) =>
        {
            const group = typeof key === 'function' ? key(item) : item[key];
            
            if(!groups[group])
            {
                groups[group] = [];
            }
            
            groups[group].push(item);
            
            return groups;
        }, {});
    },
    
    HelperChunk(array, size)
    {
        const chunks = [];
        
        for(let i = 0; i < array.length; i += size)
        {
            chunks.push(array.slice(i, i + size));
        }
        
        return chunks;
    },
    
    HelperFlatten(array, depth = 1)
    {
        if(depth <= 0) return array.slice();
        
        return array.reduce((flat, item) =>
        {
            if(Array.isArray(item))
            {
                return flat.concat(this.HelperFlatten(item, depth - 1));
            }
            
            return flat.concat(item);
        }, []);
    },
    
    HelperUnique(array, key)
    {
        if(!key)
        {
            return [...new Set(array)];
        }
        
        const seen = new Set();
        
        return array.filter(item =>
        {
            const k = typeof key === 'function' ? key(item) : item[key];
            
            if(seen.has(k))
            {
                return false;
            }
            
            seen.add(k);
            return true;
        });
    },

    HelperRegex(pattern, defaultFlags = '')
    {
        if (typeof pattern !== 'string')
        {
            return null;
        }

        if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0)
        {
            const lastSlashIndex = pattern.lastIndexOf('/');
            const regexPattern = pattern.substring(1, lastSlashIndex);
            const flags = pattern.substring(lastSlashIndex + 1) || defaultFlags;

            try
            {
                return new RegExp(regexPattern, flags);
            }
            catch (e)
            {
                return null;
            }
        }

        try
        {
            return new RegExp(pattern, defaultFlags);
        }
        catch (e)
        {
            return null;
        }
    }
};

export default DivhuntHelper;