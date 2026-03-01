onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-textarea',
		icon: 'notes',
		name: 'Textarea',
		description: 'Multi-line text input with variant support.',
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
			placeholder: {
				type: 'string',
				value: ''
			},
			rows: {
				type: 'number',
				value: 4
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
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
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
					<textarea
						:value="value"
						:placeholder="placeholder"
						:name="name"
						:rows="rows"
						:maxlength="maxlength"
						:disabled="disabled"
						:readonly="readonly"
						autocomplete="off"
						ot-input="_input"
						ot-change="_change"
						ot-focus="_focus"
						ot-blur="_blur"
					></textarea>
				</div>
			`;
		}
	});
});
