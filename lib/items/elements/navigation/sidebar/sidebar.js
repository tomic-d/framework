onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-sidebar',
		icon: 'side_navigation',
		name: 'Sidebar',
		description: 'Vertical navigation sidebar with grouped items and slots.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			groups: {
				type: 'array',
				value: []
			},
			active: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: [],
				options: ['bg-2', 'border']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.handleClick = (item) =>
			{
				this.active = item.value;

				if(this._click)
				{
					this._click(item);
				}
			};

			return `
				<nav :class="'holder ' + variant.join(' ')">
					<slot name="top"></slot>
					<div ot-for="group in groups" class="group">
						<p ot-if="group.title" class="title">{{ group.title }}</p>
						<a ot-for="item in group.items" :class="'item' + (item.value === active ? ' active' : '')" :href="item.href || 'javascript:void(0)'" ot-click="handleClick(item)">
							<i ot-if="item.icon">{{ item.icon }}</i>
							<span>{{ item.label }}</span>
							<span ot-if="item.count !== undefined" class="count">{{ item.count }}</span>
						</a>
					</div>
					<slot name="bottom"></slot>
				</nav>
			`;
		}
	});
});
