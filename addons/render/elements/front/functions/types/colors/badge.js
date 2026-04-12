onetype.AddonReady('elements', () => 
{
    const colors = {
        new: 'brand',
        featured: 'brand',
        pro: 'brand',
        premium: 'brand',
        beta: 'blue',
        info: 'blue',
        warning: 'orange',
        danger: 'red',
        success: 'green'
    };

    elements.Fn('type.colors.badge', function(overrides)
    {
        return { ...colors, ...(overrides || {}) };
    });
});
