onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-tabs',
		icon: 'tab',
		name: 'Tabs',
		description: 'Pill-style tab switcher with optional icons.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			active: {
				type: 'string',
				value: ''
			},
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string', value: '' },
						label: { type: 'string', value: '' },
						icon: { type: 'string', value: '' },
						href: { type: 'string', value: '' }
					}
				}
			},
			variant: {
				type: 'array',
				value: ['bg-2'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.select = (id) =>
			{
				this.active = id;

				if(this._change)
				{
					this._change(id);
				}
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<a ot-for="item in items" :class="'tab' + (active === item.id ? ' active' : '')" :href="item.href || 'javascript:void(0)'" ot-click="select(item.id)">
						<i ot-if="item.icon">{{ item.icon }}</i>
						<span>{{ item.label }}</span>
					</a>
				</div>
			`;
		}
	});
});
