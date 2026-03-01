onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-input',
		icon: 'input',
		name: 'Input',
		description: 'Text input field with icon support and variant options.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string',
				value: ''
			},
			name: {
				type: 'string',
				value: ''
			},
			type: {
				type: 'string',
				value: 'text'
			},
			placeholder: {
				type: 'string',
				value: ''
			},
			icon: {
				type: 'string',
				value: ''
			},
			iconRight: {
				type: 'string',
				value: ''
			},
			maxlength: {
				type: 'number'
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			readonly: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_input: {
				type: 'function'
			},
			_change: {
				type: 'function'
			},
			_focus: {
				type: 'function'
			},
			_blur: {
				type: 'function'
			}
		},
		render: function()
		{
			return `
				<div :class="'holder ' + variant.join(' ')">
					<i ot-if="icon" class="icon">{{ icon }}</i>
					<input
						:value="value"
						:type="type"
						:placeholder="placeholder"
						:name="name"
						:maxlength="maxlength"
						:disabled="disabled"
						:readonly="readonly"
						autocomplete="off"
						ot-input="_input"
						ot-change="_change"
						ot-focus="_focus"
						ot-blur="_blur"
					/>
					<i ot-if="iconRight" class="icon">{{ iconRight }}</i>
				</div>
			`;
		}
	});
});
