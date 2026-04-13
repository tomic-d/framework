onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-accordion',
		icon: 'expand_more',
		name: 'Accordion',
		description: 'Expandable panel list with icons, descriptions, single or multiple open mode.',
		category: 'Global',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				description: 'Panel items.',
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string',
							description: 'Unique item identifier.'
						},
						title:
						{
							type: 'string',
							description: 'Panel header title.'
						},
						description:
						{
							type: 'string',
							description: 'Subtitle below title.'
						},
						icon:
						{
							type: 'string',
							description: 'Leading icon in header.'
						},
						content:
						{
							type: 'string',
							description: 'Panel body HTML.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Prevent toggle.'
						}
					}
				}
			},
			active:
			{
				type: 'string|array',
				description: 'Open panel id(s). String for single, array for multiple.'
			},
			multiple:
			{
				type: 'boolean',
				value: false,
				description: 'Allow multiple panels open.'
			},
			tone:
			{
				type: 'string',
				value: 'rows',
				options: ['rows', 'cards', 'minimal'],
				description: 'Visual tone.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Accordion size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'],
				description: 'Visual modifiers.'
			},
			_change:
			{
				type: 'function',
				description: 'Toggle handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.normalized = this.items.map((item, index) => ({
					id: item.id || String(index),
					title: item.title || '',
					description: item.description,
					icon: item.icon,
					content: item.content || '',
					disabled: !!item.disabled
				}));

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
			});

			/* ===== HANDLERS ===== */

			this.isOpen = (item) =>
			{
				if(Array.isArray(this.active))
				{
					return this.active.includes(item.id);
				}

				return this.active === item.id;
			};

			this.toggle = (item, event) =>
			{
				if(item.disabled)
				{
					return;
				}

				let next;

				if(this.multiple)
				{
					const current = Array.isArray(this.active) ? [...this.active] : [];
					const index = current.indexOf(item.id);

					if(index === -1)
					{
						current.push(item.id);
					}
					else
					{
						current.splice(index, 1);
					}

					next = current;
				}
				else
				{
					next = this.active === item.id ? '' : item.id;
				}

				this.active = next;

				if(this._change)
				{
					this._change({ event, value: next });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div
						ot-for="item in normalized"
						:class="'item' + (isOpen(item) ? ' open' : '') + (item.disabled ? ' disabled' : '')"
					>
						<button
							type="button"
							class="header"
							:disabled="item.disabled"
							ot-click="(event) => toggle(item, event)"
						>
							<i ot-if="item.icon" class="leading">{{ item.icon }}</i>
							<div class="text">
								<span class="title">{{ item.title }}</span>
								<span ot-if="item.description" class="description">{{ item.description }}</span>
							</div>
							<i class="chevron">expand_more</i>
						</button>
						<div ot-if="isOpen(item)" class="panel">
							<div class="content"><span ot-html="item.content"></span></div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
