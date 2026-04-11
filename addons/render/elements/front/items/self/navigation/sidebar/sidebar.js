onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-sidebar',
		icon: 'side_navigation',
		name: 'Sidebar',
		description: 'Secondary navigation sidebar with grouped items, header, badges and mobile drawer.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			title: {
				type: 'string'
			},
			subtitle: {
				type: 'string'
			},
			version: {
				type: 'string'
			},
			groups: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						title: { type: 'string' },
						placement: { type: 'string', value: 'top', options: ['top', 'bottom'] },
						items: {
							type: 'array',
							value: [],
							each: {
								type: 'object',
								config: {
									icon: { type: 'string' },
									label: { type: 'string' },
									href: { type: 'string' },
									target: { type: 'string' },
									match: { type: 'string' },
									value: { type: 'string' },
									badge: { type: 'string|number' },
									count: { type: 'string|number' },
									soon: { type: 'boolean' },
									disabled: { type: 'boolean' }
								}
							}
						}
					}
				}
			},
			active: {
				type: 'string'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border-right'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			const path = onetype.RouteCurrent();

			this.isActive = (item) =>
			{
				if(item.soon || item.disabled)
				{
					return false;
				}

				if(item.value && this.active)
				{
					return item.value === this.active;
				}

				if(item.match)
				{
					return path === item.match;
				}

				if(!item.href)
				{
					return false;
				}

				if(item.href === '/')
				{
					return path === '/';
				}

				return path.startsWith(item.href);
			};

			this.compute = (groups) =>
			{
				return (groups || [])
					.filter(group => group.items && group.items.length)
					.map(group => ({
						...group,
						items: group.items.map(item => ({ ...item, active: this.isActive(item) }))
					}));
			};

			this.top = this.compute(this.groups.filter(group => (group.placement || 'top') === 'top'));
			this.bottom = this.compute(this.groups.filter(group => group.placement === 'bottom'));

			this.hasHead = !!this.title || !!this.subtitle || !!this.version || !!this.Slots.top;
			this.hasFoot = !!this.Slots.bottom;
			this.open = false;

			this.handle = (item, event) =>
			{
				if(item.soon || item.disabled)
				{
					return;
				}

				this.open = false;

				if(this._click)
				{
					this._click({ event, value: item });
				}
			};

			this.toggle = () =>
			{
				this.open = !this.open;
			};

			return /* html */ `
				<aside :class="'holder ' + variant.join(' ')">
					<div ot-if="hasHead" class="head">
						<slot name="top"></slot>
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="subtitle" class="subtitle">{{ subtitle }}</div>
						<div ot-if="version" class="version">{{ version }}</div>
					</div>

					<nav class="stack">
						<div ot-for="group in top" class="group">
							<div ot-if="group.title" class="group-title">{{ group.title }}</div>
							<a
								ot-for="item in group.items"
								:class="'item' + (item.active ? ' active' : '') + (item.soon ? ' soon' : '') + (item.disabled ? ' disabled' : '')"
								:href="item.href && !item.soon && !item.disabled ? item.href : 'javascript:void(0)'"
								:target="item.target"
								ot-click="(event) => handle(item, event)"
							>
								<i ot-if="item.icon">{{ item.icon }}</i>
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
								<span ot-if="item.count != null && !item.badge" class="count">{{ item.count }}</span>
								<span ot-if="item.soon" class="soon-badge">Soon</span>
								<i ot-if="!item.badge && item.count == null && !item.soon && !item.disabled" class="chevron">chevron_right</i>
							</a>
						</div>
					</nav>

					<nav ot-if="bottom.length" class="stack bottom">
						<div ot-for="group in bottom" class="group">
							<div ot-if="group.title" class="group-title">{{ group.title }}</div>
							<a
								ot-for="item in group.items"
								:class="'item' + (item.active ? ' active' : '') + (item.soon ? ' soon' : '') + (item.disabled ? ' disabled' : '')"
								:href="item.href && !item.soon && !item.disabled ? item.href : 'javascript:void(0)'"
								:target="item.target"
								ot-click="(event) => handle(item, event)"
							>
								<i ot-if="item.icon">{{ item.icon }}</i>
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
								<span ot-if="item.count != null && !item.badge" class="count">{{ item.count }}</span>
								<span ot-if="item.soon" class="soon-badge">Soon</span>
								<i ot-if="!item.badge && item.count == null && !item.soon && !item.disabled" class="chevron">chevron_right</i>
							</a>
						</div>
					</nav>

					<div ot-if="hasFoot" class="foot">
						<slot name="bottom"></slot>
					</div>
				</aside>
			`;
		}
	});
});
