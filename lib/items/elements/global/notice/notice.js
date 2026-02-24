onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-notice',
		icon: 'info',
		name: 'Notice',
		description: 'Notice banner with icon, text, and color variants.',
		category: 'Global',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: 'info'
			},
			text: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'string',
				value: 'red',
				options: ['red', 'green', 'blue', 'orange', 'brand', 'bg-1', 'bg-2', 'bg-3', 'bg-4']
			}
		},
		render: function()
		{
			return `
				<div class="holder" :variant="variant">
					<i ot-if="icon" class="icon">{{ icon }}</i>
					<span class="text">{{ text }}</span>
				</div>
			`;
		}
	});
});
