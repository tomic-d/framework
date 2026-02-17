divhunt.AddonReady('elements', (elements) =>
{
    elements.ItemAdd({
        id: 'tooltip',
        icon: 'info',
        name: 'Tooltip',
        description: 'Rich tooltip with icon, title, and text.',
        category: 'Feedback',
        config: {
            variant: {
                type: 'string',
                value: 'default',
                options: ['default', 'info', 'success', 'warning', 'error']
            },
            icon: {
                type: 'string',
                value: null
            },
            title: {
                type: 'string',
                value: null
            },
            text: {
                type: 'string',
                value: ''
            }
        },
        render: function()
        {
            return `
                <div class="holder" :variant="variant">
                    <i dh-if="icon" class="icon">{{ icon }}</i>

                    <div class="content">
                        <div dh-if="title" class="title">{{ title }}</div>
                        <div dh-if="text" class="text">{{ text }}</div>
                    </div>
                </div>
            `;
        }
    });
});
