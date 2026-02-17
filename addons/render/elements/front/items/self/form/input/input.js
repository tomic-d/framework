import elements from '#elements/load.js';

elements.ItemAdd({
    id: 'input',
    icon: 'input',
    name: 'Input',
    description: 'Text input field with variant support, placeholder, validation, and built-in error states. Supports all standard input types.',
    category: 'Form',
    author: 'Divhunt',
    config: {
        value: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        type: {
            type: 'string',
            value: 'text'
        },
        placeholder: {
            type: 'string'
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
            value: ['bg-2', 'border-full'],
            options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border-full']
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
        },
        onFocus: {
            type: 'function'
        },
        onBlur: {
            type: 'function'
        }
    },
    render: function()
    {
        return `
            <input
                class="holder"
                :variant="variant.join(' ')"
                :size="size"
                :value="value"
                :type="type"
                :placeholder="placeholder"
                :name="name"
                :maxlength="maxLength"
                :disabled="disabled"
                :readonly="readonly"
                autocomplete="off"
                dh-input="onInput"
                dh-change="onChange"
                dh-focus="onFocus"
                dh-blur="onBlur"
            />
        `;
    }
});
