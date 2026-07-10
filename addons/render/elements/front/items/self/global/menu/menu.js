onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-menu',
		icon: 'menu',
		name: 'Menu',
		description: 'Context menu with icons, descriptions, shortcuts, badges, nested submenus and color accents.',
		category: 'Global',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				description: 'Menu entries.',
				each:
				{
					type: 'object',
					config:
					{
						type:
						{
							type: 'string',
							value: 'action',
							options: ['action', 'link', 'separator', 'header'],
							description: 'Entry type.'
						},
						id:
						{
							type: 'string',
							description: 'Unique identifier.'
						},
						label:
						{
							type: 'string',
							description: 'Display label.'
						},
						description:
						{
							type: 'string',
							description: 'Secondary line below label.'
						},
						icon:
						{
							type: 'string',
							description: 'Leading icon.'
						},
						iconRight:
						{
							type: 'string',
							description: 'Trailing icon.'
						},
						shortcut:
						{
							type: 'string',
							description: 'Keyboard shortcut hint.'
						},
						badge:
						{
							type: 'string|number',
							description: 'Badge count or text.'
						},
						value:
						{
							type: 'string',
							description: 'Value passed to _select.'
						},
						href:
						{
							type: 'string',
							description: 'Link URL.'
						},
						target:
						{
							type: 'string',
							description: 'Link target.'
						},
						active:
						{
							type: 'boolean',
							description: 'Active highlight.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Disabled state.'
						},
						danger:
						{
							type: 'boolean',
							description: 'Danger red accent.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Icon color accent.'
						},
						items:
						{
							type: 'array',
							description: 'Nested submenu entries.'
						}
					}
				}
			},
			depth:
			{
				type: 'number',
				value: 0,
				description: 'Nesting depth. Auto-incremented for submenus.'
			},
			tone:
			{
				type: 'string',
				value: 'default',
				options: ['default', 'contextual', 'flush', 'bordered'],
				description: 'Container style.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Row height.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
				description: 'Border modifiers.'
			},
			_select:
			{
				type: 'function',
				description: 'Select handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.opened = {};

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.tone, 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				this.variant.forEach(v => list.push(v));

				return list.join(' ');
			};

			this.entryClass = (item) =>
			{
				const list = ['entry', item.type];

				if(item.disabled)
				{
					list.push('disabled');
				}

				if(item.active)
				{
					list.push('active');
				}

				if(item.danger)
				{
					list.push('danger');
				}

				if(item.color)
				{
					list.push('color-' + item.color);
				}

				if(this.hasChildren(item))
				{
					list.push('parent');
				}

				if(this.isOpen(item.id || item.label))
				{
					list.push('open');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.hasChildren = (item) =>
			{
				return item.items && item.items.length > 0;
			};

			this.isOpen = (id) =>
			{
				return !!this.opened[id];
			};

			this.toggle = (item) =>
			{
				if(item.disabled)
				{
					return;
				}

				this.opened[item.id || item.label] = !this.opened[item.id || item.label];
				this.Update();
			};

			this.select = (item) =>
			{
				if(item.disabled)
				{
					return;
				}

				if(this.hasChildren(item))
				{
					this.toggle(item);
					return;
				}

				if(this._select)
				{
					this._select({ event: null, value: item.value || item.id || item.label });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div
						ot-for="item in items"
						:class="entryClass(item)"
					>
						<div ot-if="item.type === 'separator'" class="separator"></div>

						<div ot-if="item.type === 'header'" class="header">{{ item.label }}</div>

						<a
							ot-if="(item.type === 'action' || item.type === 'link') && !hasChildren(item)"
							:href="item.href || 'javascript:void(0)'"
							:target="item.target"
							class="row"
							ot-click="() => select(item)"
						>
							<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
							<div class="text">
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.description" class="description">{{ item.description }}</span>
							</div>
							<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
							<span ot-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
							<i ot-if="item.iconRight" class="trail">{{ item.iconRight }}</i>
						</a>

						<button
							ot-if="item.type === 'action' && hasChildren(item)"
							type="button"
							class="row"
							ot-click="() => toggle(item)"
						>
							<i ot-if="item.icon" class="icon">{{ item.icon }}</i>
							<div class="text">
								<span class="label">{{ item.label }}</span>
								<span ot-if="item.description" class="description">{{ item.description }}</span>
							</div>
							<span ot-if="item.badge" class="badge">{{ item.badge }}</span>
							<i class="arrow">expand_more</i>
						</button>

						<div ot-if="hasChildren(item) && isOpen(item.id || item.label)" class="submenu">
							<e-global-menu
								:items="item.items"
								:depth="depth + 1"
								tone="flush"
								:size="size"
								:_select="_select"
							></e-global-menu>
						</div>
					</div>
				</div>
			`;
		}
	});
});
