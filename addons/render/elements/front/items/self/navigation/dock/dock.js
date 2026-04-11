onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-dock',
		icon: 'dock_to_right',
		name: 'Dock',
		description: 'Slim icon rail with grouped navigation, logo, badges and tooltips.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			logo: {
				type: 'string'
			},
			groups: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
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
									match: { type: 'string' },
									badge: { type: 'string|number' }
								}
							}
						}
					}
				}
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
				const match = item.match || item.href;

				if(!match)
				{
					return false;
				}

				if(match === '/')
				{
					return path === '/';
				}

				return path.startsWith(match);
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

			this.handle = (item, event) =>
			{
				if(this._click)
				{
					this._click({ event, value: item });
				}
			};

			return /* html */ `
				<aside :class="'holder ' + variant.join(' ')">
					<a ot-if="logo" class="logo" href="/">
						<img :src="logo" alt="" />
					</a>

					<div class="stack">
						<div ot-for="group, groupIndex in top">
							<div ot-if="groupIndex > 0 || logo" class="separator"></div>
							<div class="group">
								<a
									ot-for="item in group.items"
									:class="'item' + (item.active ? ' active' : '')"
									:href="item.href || 'javascript:void(0)'"
									:ot-tooltip="item.label ? { text: item.label, position: { x: 'right', y: 'center' } } : null"
									ot-click="(event) => handle(item, event)"
								>
									<i>{{ item.icon }}</i>
									<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
								</a>
							</div>
						</div>
					</div>

					<div ot-if="bottom.length" class="stack bottom">
						<div ot-for="group, groupIndex in bottom">
							<div ot-if="groupIndex > 0" class="separator"></div>
							<div class="group">
								<a
									ot-for="item in group.items"
									:class="'item' + (item.active ? ' active' : '')"
									:href="item.href || 'javascript:void(0)'"
									:ot-tooltip="item.label ? { text: item.label, position: { x: 'right', y: 'center' } } : null"
									ot-click="(event) => handle(item, event)"
								>
									<i>{{ item.icon }}</i>
									<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
								</a>
							</div>
						</div>
					</div>
				</aside>
			`;
		}
	});
});
