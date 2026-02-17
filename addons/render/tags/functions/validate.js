import tags from '#tags/addon.js';

tags.Fn('validate', function(parentTag, childTag)
{
    const parent = this.ItemGet(parentTag);
    const child = this.ItemGet(childTag);
    
    if(!parent || !child)
    {
        return false;
    }
    
    const nest = parent.Get('nest');
    const groups = this.Fn('groups');
    
    this.methods.check = (rules, tag) =>
    {
        return rules.some(rule =>
        {
            if(rule === '*')
            {
                return true;
            }
            
            if(rule.startsWith('@'))
            {
                const groupName = rule.substring(1);
                return groups[groupName] && groups[groupName].includes(tag);
            }
            
            return rule === tag;
        });
    };
    
    if(nest.allowed)
    {
        if(nest.allowed.includes('*'))
        {
            return !nest.disallowed || !this.methods.check(nest.disallowed, childTag);
        }
        
        return this.methods.check(nest.allowed, childTag);
    }
    
    if(nest.disallowed)
    {
        return !this.methods.check(nest.disallowed, childTag);
    }
    
    return true;
});