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
				value: [],
				each: {
					type: 'object',
					config: {
						name: { type: 'string', value: '' },
						type: { type: 'string', value: '' },
						required: { type: 'boolean', value: false },
						description: { type: 'string', value: '' }
					}
				}
			},
			variant: {
				type: 'array',
				value: [],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border']
			}
		},
		render: function()
		{
			return `
				<div :class="'holder ' + variant.join(' ')">
					<div ot-for="item in items" class="param">
						<div class="left">
							<span class="name">{{ item.name }}</span>
							<span class="type">{{ item.type }}</span>
							<span ot-if="item.required" class="required">required</span>
						</div>
						<span ot-if="item.description" class="description">{{ item.description }}</span>
					</div>
				</div>
			`;
		}
	});
});
