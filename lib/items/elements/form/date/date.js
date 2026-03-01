onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-date',
		icon: 'calendar_today',
		name: 'Date',
		description: 'Date picker input with native calendar.',
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
			min: {
				type: 'string',
				value: ''
			},
			max: {
				type: 'string',
				value: ''
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handle = (event, ctx) =>
			{
				this.value = ctx.value;
				this.Update();

				if (this._change)
				{
					this._change(ctx.value);
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<input
						class="input"
						type="date"
						:value="value"
						:name="name"
						:min="min"
						:max="max"
						:disabled="disabled"
						ot-change="handle"
					/>
				</div>
			`;
		}
	});
});
