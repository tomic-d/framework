onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-checkbox',
		icon: 'check_box',
		name: 'Checkbox',
		description: 'Checkbox with label, description, icon, count, indeterminate and color variants.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Checkbox label.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below label.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Icon between mark and label.'
			},
			count:
			{
				type: 'string|number',
				description: 'Count badge at the end.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Input name attribute.'
			},
			value:
			{
				type: 'boolean',
				value: false,
				description: 'Checked state.'
			},
			indeterminate:
			{
				type: 'boolean',
				value: false,
				description: 'Partial selection state.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Checked mark color.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Mark background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Checkbox size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'reverse'],
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
			},
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.hasInfo = !!this.label || !!this.description;
			this.hasIcon = !!this.icon;
			this.hasCount = this.count !== undefined && this.count !== null && this.count !== '';

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'color-' + this.color, 'size-' + this.size];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('reverse'))
				{
					list.push('reverse');
				}

				if(this.indeterminate)
				{
					list.push('indeterminate');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.handle = ({ event }) =>
			{
				this.value = event.target.checked;
				this.indeterminate = false;

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			this.click = ({ event }) =>
			{
				if(this._click)
				{
					this._click({ event, value: this.value });
				}
			};

			/* ===== LIFECYCLE ===== */

			this.OnReady(() =>
			{
				const input = this.Element?.querySelector('input');

				if(input)
				{
					input.indeterminate = !!this.indeterminate;
				}
			});

			/* ===== RENDER ===== */

			return /* html */ `
				<label :class="classes()">
					<input
						type="checkbox"
						:name="name"
						:checked="value"
						:disabled="disabled"
						ot-change="handle"
						ot-click="click"
					/>
					<span class="mark"></span>
					<i ot-if="hasIcon" class="icon">{{ icon }}</i>
					<span ot-if="hasInfo" class="info">
						<span ot-if="label" class="label">{{ label }}</span>
						<span ot-if="description" class="description">{{ description }}</span>
					</span>
					<span ot-if="hasCount" class="count">{{ count }}</span>
				</label>
			`;
		}
	});
});
