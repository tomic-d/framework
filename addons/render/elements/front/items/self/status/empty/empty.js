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
				type: 'string',
				value: ''
			},
			action: {
				type: 'string',
				value: ''
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			return `
				<div class="holder">
					<div class="circle"><i>{{ icon }}</i></div>
					<h2 class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button ot-if="action" :text="action" icon="add" :variant="['brand', 'size-m']" :_click="_click"></e-form-button>
				</div>
			`;
		}
	});
});
