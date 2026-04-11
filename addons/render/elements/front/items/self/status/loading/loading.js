onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-loading',
		icon: 'progress_activity',
		name: 'Loading',
		description: 'Loading state with spinner and optional message.',
		category: 'Status',
		author: 'OneType',
		config: {
			text: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div class="circle"><i class="spinner">progress_activity</i></div>
					<span ot-if="text" class="text">{{ text }}</span>
				</div>
			`;
		}
	});
});
