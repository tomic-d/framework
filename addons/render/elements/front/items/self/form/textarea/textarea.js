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
			this.input = ({ event, value }) =>
			{
				this.value = value;

				if (this._input)
				{
					this._input({ event, value });
				}
			};

			this.change = ({ event, value }) =>
			{
				this.value = value;

				if (this._change)
				{
					this._change({ event, value });
				}
			};

			this.focus = ({ event, value }) =>
			{
				if (this._focus)
				{
					this._focus({ event, value });
				}
			};

			this.blur = ({ event, value }) =>
			{
				if (this._blur)
				{
					this._blur({ event, value });
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<textarea
						:placeholder="placeholder"
						:name="name"
						:rows="rows"
						:maxlength="maxlength"
						:disabled="disabled"
						:readonly="readonly"
						autocomplete="off"
						ot-input="input"
						ot-change="change"
						ot-focus="focus"
						ot-blur="blur"
					>{{ value }}</textarea>
				</div>
			`;
		}
	});
});
