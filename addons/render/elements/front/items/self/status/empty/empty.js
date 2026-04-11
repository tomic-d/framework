onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-empty',
		icon: 'inbox',
		name: 'Empty',
		description: 'Full-page empty state with icon, message, and optional action.',
		category: 'Status',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: 'inbox'
			},
			title: {
				type: 'string',
				value: 'Nothing here yet'
			},
			description: {
				type: 'string'
			},
			action: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div class="circle"><i>{{ icon }}</i></div>
					<h2 ot-if="title" class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button
						ot-if="action"
						:text="action"
						icon="add"
						:variant="['brand', 'size-m']"
						:_click="_click"
					></e-form-button>
				</div>
			`;
		}
	});
});
