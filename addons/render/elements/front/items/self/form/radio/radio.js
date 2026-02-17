import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'radio',
    icon: 'radio_button_checked',
    name: 'Radio',
    description: 'Radio button input with custom styling, group support, and multiple size options for different form contexts.',
    category: 'Form',
    author: 'Divhunt',
    config: {
        name: {
            type: 'string'
        },
        value: {
            type: 'string'
        },
        checked: {
            type: 'boolean'
        },
        disabled: {
            type: 'boolean'
        },
        variant: {
            type: 'array',
            value: ['bg-1'],
            options: ['transparent', 'border', 'bg-1', 'bg-2', 'bg-3', 'bg-4']
        },
        size: {
            type: 'string',
            value: 'm',
            options: ['s', 'm', 'l']
        },
        onChange: {
            type: 'function'
        },
        onClick: {
            type: 'function'
        }
    },
    render: function()
    {
        return `
            <div class="holder" :variant="variant.join(' ')" :size="size">
                <input
                    type="radio"
                    :name="name"
                    :value="value"
                    :checked="checked"
                    :disabled="disabled"
                    dh-change="onChange"
                    dh-click="onClick"
                />
                <span class="radio-mark"></span>
            </div>
        `;
    }
});
