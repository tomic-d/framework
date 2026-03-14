onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-checkbox',
		icon: 'check_box',
		name: 'Checkbox',
		description: 'Checkbox input with custom styling.',
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
			this.handle = ({ event }) =>
			{
				this.value = event.target.checked;

				if (this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			this.click = ({ event }) =>
			{
				if (this._click)
				{
					this._click({ event, value: this.value });
				}
			};

			return `
				<label :class="'holder ' + variant.join(' ')">
					<input
						type="checkbox"
						:name="name"
						:checked="value"
						:disabled="disabled"
						ot-change="handle"
						ot-click="click"
					/>
					<span class="mark"></span>
					<span ot-if="label" class="label">{{ label }}</span>
				</label>
			`;
		}
	});
});
