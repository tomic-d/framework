onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-toggle',
		icon: 'toggle_on',
		name: 'Toggle',
		description: 'On/off switch toggle.',
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
				value: ['bg-3', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handle = (event) =>
			{
				event.preventDefault();

				if (this.disabled)
				{
					return;
				}

				this.checked = !this.checked;
				this.Update();

				if (this._change)
				{
					this._change(this.checked);
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ') + (checked ? ' active' : '') + (disabled ? ' disabled' : '')" ot-click="handle">
					<input type="hidden" :name="name" :value="checked ? 'on' : 'off'" />
					<span class="track">
						<span class="thumb"></span>
					</span>
					<span ot-if="label" class="label">{{ label }}</span>
				</div>
			`;
		}
	});
});
