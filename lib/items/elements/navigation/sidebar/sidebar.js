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
			const path = onetype.RouteCurrent();

			this.top = this.groups.filter(g => !g.placement || g.placement === 'top');
			this.bottom = this.groups.filter(g => g.placement === 'bottom');

			this.isActive = (item) =>
			{
				if(item.href)
				{
					if(item.match === 'exact' || item.href === '/') return path === item.href;
					return path.startsWith(item.href);
				}

				return item.value === this.active;
			};

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
					<div ot-for="group in top" class="group">
						<p ot-if="group.title" class="title">{{ group.title }}</p>
						<a ot-for="item in group.items" :class="'item' + (isActive(item) ? ' active' : '')" :href="item.href || 'javascript:void(0)'" ot-click="handleClick(item)">
							<i ot-if="item.icon">{{ item.icon }}</i>
							<span>{{ item.label }}</span>
							<span ot-if="item.count !== undefined" class="count">{{ item.count }}</span>
						</a>
					</div>
					<div ot-if="bottom.length" class="bottom">
						<div ot-for="group in bottom" class="group">
							<p ot-if="group.title" class="title">{{ group.title }}</p>
							<a ot-for="item in group.items" :class="'item' + (isActive(item) ? ' active' : '')" :href="item.href || 'javascript:void(0)'" ot-click="handleClick(item)">
								<i ot-if="item.icon">{{ item.icon }}</i>
								<span>{{ item.label }}</span>
								<span ot-if="item.count !== undefined" class="count">{{ item.count }}</span>
							</a>
						</div>
					</div>
					<slot name="bottom"></slot>
				</nav>
			`;
		}
	});
});
