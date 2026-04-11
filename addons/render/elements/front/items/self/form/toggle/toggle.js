onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-toggle',
		icon: 'toggle_on',
		name: 'Toggle',
		description: 'Premium on/off switch with label, description, color variants and reverse mode.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			name: {
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
				value: ['bg-3', 'size-m'],
				options: [
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'border',
					'color-brand', 'color-blue', 'color-red', 'color-orange', 'color-green',
					'size-s', 'size-m', 'size-l',
					'reverse'
				]
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.hasInfo = !!this.label || !!this.description;

			this.handle = ({ event }) =>
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

			return /* html */ `
				<label :class="'holder ' + variant.join(' ') + (value ? ' active' : '') + (disabled ? ' disabled' : '')" ot-click="handle">
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
						<span ot-if="description" class="description">{{ description }}</span>
					</span>
				</label>
			`;
		}
	});
});
