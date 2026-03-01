onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-navbar',
		icon: 'menu',
		name: 'Navbar',
		description: 'Top navigation bar with logo and links.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						icon: { type: 'string', value: '' },
						label: { type: 'string', value: '' },
						href: { type: 'string', value: '' },
						target: { type: 'string', value: '' },
						position: { type: 'string', value: 'left', options: ['left', 'right'] },
						match: { type: 'string|array', value: '' }
					}
				}
			},
			variant: {
				type: 'array',
				value: ['bg-1'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4']
			}
		},
		render: function()
		{
			const path = onetype.RouteCurrent();

			const isActive = (item) =>
			{
				if(item.match)
				{
					const patterns = Array.isArray(item.match) ? item.match : [item.match];
					return patterns.some(pattern => onetype.RouteMatch(pattern, path).match);
				}

				return item.href === '/' ? path === '/' : path.startsWith(item.href);
			};

			this.left = this.items.filter(item => item.position === 'left').map(item => ({
				...item,
				active: isActive(item)
			}));

			this.right = this.items.filter(item => item.position === 'right').map(item => ({
				...item,
				active: isActive(item)
			}));

			this.all = [...this.left, ...this.right];
			this.open = false;

			this.toggle = () =>
			{
				this.open = !this.open;
			};

			return `
				<nav :class="'holder ' + variant.join(' ')">
					<a class="logo" href="/">
						<img class="logo-icon" src="https://cdn.onetype.ai/brand/logo/full-orange.svg" alt="OneType" />
						<i class="logo-arrow">keyboard_arrow_down</i>
					</a>
					<div class="tabs">
						<a ot-for="item in left" :class="'tab' + (item.active ? ' active' : '')" :href="item.href" :target="item.target || null"><i>{{ item.icon }}</i> {{ item.label }}</a>
					</div>
					<div class="right">
						<a ot-for="item in right" :class="'tab' + (item.active ? ' active' : '')" :href="item.href" :target="item.target || null"><i>{{ item.icon }}</i> {{ item.label }}</a>
					</div>
					<button class="burger" ot-click="toggle"><i>{{ open ? 'close' : 'menu' }}</i></button>
				</nav>
				<div ot-if="open" class="menu">
					<a ot-for="item in all" :class="'link' + (item.active ? ' active' : '')" :href="item.href" :target="item.target || null"><i>{{ item.icon }}</i> {{ item.label }}</a>
				</div>
			`;
		}
	});
});
