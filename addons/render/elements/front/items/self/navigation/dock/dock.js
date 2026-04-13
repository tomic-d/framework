onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-dock',
		icon: 'dock_to_right',
		name: 'Dock',
		description: 'Slim icon rail with grouped navigation, logo, badges and tooltips.',
		category: 'Navigation',
		config:
		{
			logo:
			{
				type: 'string',
				value: '',
				description: 'Logo image URL. Links to /.'
			},
			groups:
			{
				type: 'array',
				value: [],
				description: 'Navigation groups.',
				each:
				{
					type: 'object',
					config:
					{
						placement:
						{
							type: 'string',
							value: 'top',
							options: ['top', 'bottom'],
							description: 'Stack position.'
						},
						items:
						{
							type: 'array',
							value: [],
							description: 'Group items.',
							each:
							{
								type: 'object',
								config:
								{
									icon:
									{
										type: 'string',
										description: 'Material icon name.'
									},
									label:
									{
										type: 'string',
										description: 'Tooltip text.'
									},
									href:
									{
										type: 'string',
										description: 'Navigation URL.'
									},
									match:
									{
										type: 'string',
										description: 'Active match path. Falls back to href.'
									},
									badge:
									{
										type: 'string|number',
										description: 'Notification badge value.'
									}
								}
							}
						}
					}
				}
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border-right'],
				each: { type: 'string' },
				options: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
				description: 'Border modifiers.'
			},
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.isActive = (item) =>
			{
				const match = item.match || item.href;

				if(!match)
				{
					return false;
				}

				if(match === '/')
				{
					return this.path === '/';
				}

				return this.path.startsWith(match);
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

			this.Compute(() =>
			{
				this.path = onetype.RouteCurrent();
				this.top = this.compute(this.groups.filter(group => (group.placement || 'top') === 'top'));
				this.bottom = this.compute(this.groups.filter(group => group.placement === 'bottom'));
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background];

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.handle = ({ event }, item) =>
			{
				if(this._click)
				{
					this._click({ event, value: item });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<aside :class="classes()">
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
									ot-click="(event) => handle(event, item)"
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
									ot-click="(event) => handle(event, item)"
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
