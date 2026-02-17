import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'interactive-html',
    icon: 'code',
    name: 'HTML Preview',
    description: 'Displays HTML content in a scaled-down preview container. Perfect for showcasing elements and components in a thumbnail view.',
    category: 'Content',
    author: 'Divhunt',
    config: {
        html: {
            type: 'string',
            value: '<div>Preview</div>'
        },
        zoom: {
            type: 'number',
            value: 0.5
        },
        size: {
            type: 'string',
            value: 'm',
            options: ['s', 'm', 'l']
        },
        variant: {
            type: 'array',
            value: [],
            options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border-full', 'radius-s', 'radius-m', 'radius-l']
        }
    },
    render: function()
    {
        return `
            <div class="holder" :variant="variant.join(' ')" :size="size">
                <div class="preview" :style="'zoom: ' + zoom">
                    <div dh-html="html"></div>
                </div>
            </div>
        `;
    }
});
