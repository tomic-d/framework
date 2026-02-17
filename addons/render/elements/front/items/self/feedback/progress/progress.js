import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'progress',
	icon: 'progress_activity',
	name: 'Progress',
	description: 'Progress bar with percentage display and multiple styles.',
	category: 'Feedback',
	author: 'Divhunt',
	config: {
		value: {
			type: 'number',
			value: 60
		},
		max: {
			type: 'number',
			value: 100
		},
		text: {
			type: 'string',
			value: ''
		},
		variant: {
			type: 'array',
			value: ['striped', 'animated', 'size-m'],
			options: ['brand', 'blue', 'red', 'orange', 'green', 'striped', 'animated', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		const percentage = Math.min(100, Math.max(0, (this.value / this.max) * 100));

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="bar" style="width: ${percentage}%"></div>
				<div dh-if="text" class="text">{{ text }}</div>
			</div>
		`;
	}
});
