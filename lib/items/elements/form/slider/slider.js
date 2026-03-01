onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-slider',
		icon: 'linear_scale',
		name: 'Slider',
		description: 'Range slider for selecting numeric values.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'number',
				value: 50
			},
			min: {
				type: 'number',
				value: 0
			},
			max: {
				type: 'number',
				value: 100
			},
			step: {
				type: 'number',
				value: 10
			},
			disabled: {
				type: 'boolean',
				value: false
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handle = (event) =>
			{
				this.value = parseFloat(event.target.value);
				if (this._change)
				{
					this._change(this.value);
				}
			};

			this.percentage = () =>
			{
				return ((this.value - this.min) / (this.max - this.min)) * 100;
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="track">
						<div class="fill" :style="'width: ' + percentage() + '%'"></div>
					</div>
					<input
						type="range"
						:value="value"
						:min="min"
						:max="max"
						:step="step"
						:disabled="disabled"
						ot-input="handle"
					/>
				</div>
			`;
		}
	});
});
