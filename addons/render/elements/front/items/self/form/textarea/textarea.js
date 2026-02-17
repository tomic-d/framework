import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'textarea',
    icon: 'notes',
    name: 'Textarea',
    description: 'Multi-line text input with auto-resize option, character counting, and variant support for different UI contexts.',
    category: 'Form',
    author: 'Divhunt',
    config: {
        value: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        placeholder: {
            type: 'string'
        },
        rows: {
            type: 'number',
            value: 4
        },
        maxLength: {
            type: 'number'
        },
        disabled: {
            type: 'boolean'
        },
        readonly: {
            type: 'boolean'
        },
        variant: {
            type: 'array',
            value: ['bg-2'],
            options: ['transparent', 'border', 'bg-1', 'bg-2', 'bg-3', 'bg-4']
        },
        size: {
            type: 'string',
            value: 'm',
            options: ['s', 'm', 'l']
        },
        onInput: {
            type: 'function'
        },
        onChange: {
            type: 'function'
        }
    },
    render: function()
    {
        return `
            <div class="holder" :variant="variant.join(' ')" :size="size">
                <textarea
                    :value="value"
                    :placeholder="placeholder"
                    :name="name"
                    :rows="rows"
                    :maxlength="maxLength"
                    :disabled="disabled"
                    :readonly="readonly"
                    autocomplete="off"
                    dh-input="onInput"
                    dh-change="onChange"
                ></textarea>
            </div>
        `;
    }
});
