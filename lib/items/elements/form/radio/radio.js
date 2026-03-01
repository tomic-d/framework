onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-radio',
		icon: 'radio_button_checked',
		name: 'Radio',
		description: 'Radio button with custom styling and group support.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string',
				value: ''
			},
			name: {
				type: 'string',
				value: ''
			},
			value: {
				type: 'string',
				value: ''
			},
			checked: {
				type: 'boolean',
				value: false
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			return `
				<label :class="'holder ' + variant.join(' ')">
					<input
						type="radio"
						:name="name"
						:value="value"
						:checked="checked"
						:disabled="disabled"
						ot-change="_change"
						ot-click="_click"
					/>
					<span class="mark"></span>
					<span ot-if="label" class="label">{{ label }}</span>
				</label>
			`;
		}
	});
});
