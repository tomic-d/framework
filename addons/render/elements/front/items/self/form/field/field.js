onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-field',
		icon: 'space_dashboard',
		name: 'Field',
		description: 'Form field with label, description, hint, required mark and error state.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Field label.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Helper text below label.'
			},
			hint:
			{
				type: 'string',
				value: '',
				description: 'Tooltip text on info icon.'
			},
			error:
			{
				type: 'string',
				value: '',
				description: 'Error message. Tints input red.'
			},
			required:
			{
				type: 'boolean',
				value: false,
				description: 'Red asterisk on label.'
			},
			orientation:
			{
				type: 'string',
				value: 'horizontal',
				options: ['horizontal', 'vertical'],
				description: 'Layout direction.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Field size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'border-bottom', 'clean'],
				description: 'Visual modifiers.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasInfo = !!this.label || !!this.description;
				this.hasError = !!this.error;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.orientation, 'size-' + this.size];

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('border-bottom'))
				{
					list.push('border-bottom');
				}

				if(this.variant.includes('clean'))
				{
					list.push('clean');
				}

				if(this.hasError)
				{
					list.push('error');
				}

				return list.join(' ');
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasInfo" class="info">
						<label ot-if="label" class="label">
							<span>{{ label }}</span>
							<span ot-if="required" class="required">*</span>
							<i ot-if="hint" class="hint" :ot-tooltip="{ text: hint, position: { x: 'center', y: 'top' } }">info</i>
						</label>
						<p ot-if="description" class="description">{{ description }}</p>
					</div>
					<div class="control">
						<div class="input">
							<slot name="input"></slot>
						</div>
						<div ot-if="hasError" class="message">
							<i>error</i>
							<span>{{ error }}</span>
						</div>
					</div>
				</div>
			`;
		}
	});
});
