onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-radio',
		icon: 'radio_button_checked',
		name: 'Radio',
		description: 'Premium radio button with label, description, color variants and group support.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			count: {
				type: 'string|number'
			},
			name: {
				type: 'string'
			},
			option: {
				type: 'string'
			},
			value: {
				type: 'boolean'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'size-m'],
				options: [
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'transparent', 'border',
					'color-brand', 'color-blue', 'color-red', 'color-orange', 'color-green',
					'size-s', 'size-m', 'size-l',
					'reverse'
				]
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
			this.hasInfo = !!this.label || !!this.description;
			this.hasIcon = !!this.icon;
			this.hasCount = this.count !== undefined && this.count !== null && this.count !== '';

			this.handle = ({ event }) =>
			{
				this.value = event.target.checked;

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

			return /* html */ `
				<label :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
					<input
						type="radio"
						:name="name"
						:value="option"
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
