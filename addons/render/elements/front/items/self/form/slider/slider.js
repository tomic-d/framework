import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'slider',
	icon: 'linear_scale',
	name: 'Slider',
	description: 'Range slider input for selecting numeric values.',
	category: 'Form',
	author: 'Divhunt',
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
		variant: {
			type: 'array',
			value: ['brand', 'size-m'],
			options: ['brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		},
		onChange: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleInput = (event) =>
		{
			this.value = parseFloat(event.target.value);
			if (this.onChange)
			{
				this.onChange(this.value);
			}
		};

		this.getPercentage = () =>
		{
			return ((this.value - this.min) / (this.max - this.min)) * 100;
		};

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="track">
					<div class="fill" :style="'width: ' + getPercentage() + '%'"></div>
				</div>
				<input
					type="range"
					class="input"
					:value="value"
					:min="min"
					:max="max"
					:step="step"
					dh-input="handleInput"
				/>
			</div>
		`;
	}
});
