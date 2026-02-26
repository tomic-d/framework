onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-parameters',
		icon: 'list',
		name: 'Parameters',
		description: 'Parameter list with name, type, required badge, and description.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: []
			},
			variant: {
				type: 'string',
				value: '',
				options: ['', 'bg-2']
			}
		},
		render: function()
		{
			return `
				<div class="holder" :variant="variant">
					<div ot-for="item in items" class="param">
						<div class="left">
							<span class="name">{{ item.name }}</span>
							<span class="type">{{ item.type }}</span>
							<span ot-if="item.required" class="required">required</span>
						</div>
						<span ot-if="item.description" class="desc">{{ item.description }}</span>
					</div>
				</div>
			`;
		}
	});
});
