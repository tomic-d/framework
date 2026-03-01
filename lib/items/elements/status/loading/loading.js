onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-loading',
		icon: 'progress_activity',
		name: 'Loading',
		description: 'Full-page loading spinner with optional message.',
		category: 'Status',
		author: 'OneType',
		config: {
			text: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: ['brand'],
				options: ['brand', 'blue', 'red', 'orange', 'green']
			}
		},
		render: function()
		{
			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="circle"><i class="spinner">progress_activity</i></div>
					<span ot-if="text" class="text">{{ text }}</span>
				</div>
			`;
		}
	});
});
