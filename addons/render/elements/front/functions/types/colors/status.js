onetype.AddonReady('elements', () => 
{
    const colors = {
        live: 'green',
        published: 'green',
        active: 'green',
        success: 'green',
        approved: 'green',
        pending: 'orange',
        review: 'orange',
        draft: 'neutral',
        archived: 'neutral',
        disabled: 'neutral',
        rejected: 'red',
        error: 'red',
        failed: 'red',
        inactive: 'red'
    };

    elements.Fn('type.colors.status', function(overrides)
    {
        return { ...colors, ...(overrides || {}) };
    });
});
