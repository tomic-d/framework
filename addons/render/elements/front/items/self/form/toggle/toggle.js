onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-toggle',
		icon: 'toggle_on',
		name: 'Toggle',
		description: 'On/off switch with label, description and color variants.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Toggle label.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below label.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Form field name.'
			},
			value:
			{
				type: 'boolean',
				value: false,
				description: 'Checked state.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Active track color.'
			},
			background:
			{
				type: 'string',
				value: 'bg-3',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Inactive track background.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Toggle size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['reverse', 'border'],
				description: 'Visual modifiers.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasInfo = !!this.label || !!this.description;

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.color, this.background, 'size-' + this.size];

				if(this.value)
				{
					list.push('active');
				}

				if(this.variant.includes('reverse'))
				{
					list.push('reverse');
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.toggle = ({ event }) =>
			{
				event.preventDefault();

				if(this.disabled)
				{
					return;
				}

				this.value = !this.value;

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<label :class="classes()" ot-click="toggle">
					<input
						type="checkbox"
						:name="name"
						:checked="value"
						:disabled="disabled"
					/>
					<span class="track">
						<span class="thumb"></span>
					</span>
					<span ot-if="hasInfo" class="info">
						<span ot-if="label" class="label">{{ label }}</span>
						<span ot-if="description" class="desc">{{ description }}</span>
					</span>
				</label>
			`;
		}
	});
});
