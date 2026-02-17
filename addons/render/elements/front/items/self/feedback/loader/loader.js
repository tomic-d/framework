import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'loader',
	icon: 'progress_activity',
	name: 'Loader',
	description: 'Loading spinner with multiple animation styles (spin, dots, pulse).',
	category: 'Feedback',
	author: 'Divhunt',
	config: {
		variant: {
			type: 'array',
			value: ['dots', 'brand', 'size-m'],
			options: ['spin', 'dots', 'pulse', 'brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="spinner"></div>
			</div>
		`;
	}
});
