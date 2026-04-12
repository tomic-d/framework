onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-tabs',
		icon: 'tab',
		name: 'Tabs',
		description: 'Tabbed navigation with multiple tones, icons, counts and content panels.',
		category: 'Navigation',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				description: 'Tab items.',
				each:
				{
					type: 'object',
					config:
					{
						id: { type: 'string', description: 'Unique tab ID.' },
						label: { type: 'string', description: 'Tab label.' },
						icon: { type: 'string', description: 'Tab icon.' },
						count: { type: 'string|number', description: 'Count badge.' },
						href: { type: 'string', description: 'Link URL.' },
						target: { type: 'string', description: 'Link target.' },
						disabled: { type: 'boolean', description: 'Disabled state.' },
						content: { type: 'string', description: 'Panel HTML content.' }
					}
				}
			},
			active:
			{
				type: 'string',
				value: '',
				description: 'Active tab ID.'
			},
			tone:
			{
				type: 'string',
				value: 'underline',
				options: ['underline', 'pills', 'contained', 'segmented'],
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
				description: 'Tab size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border', 'stretch'],
				description: 'Visual modifiers.'
			},
			_change:
			{
				type: 'function',
				description: 'Tab change handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			if(!this.active && this.items.length)
			{
				this.active = this.items[0].id;
			}

			this.hasContent = this.items.some(item => item.content);

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.tone, 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('stretch'))
				{
					list.push('stretch');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.select = (item, event) =>
			{
				if(item.disabled)
				{
					return;
				}

				this.active = item.id;

				if(this._change)
				{
					this._change({ event, value: item.id });
				}
			};

			/* ===== RENDER ===== */

			this.panels = this.items
				.filter(item => item.content)
				.map(item =>
				{
					return '<div class="panel' + (this.active === item.id ? ' active' : '') + '" data-panel="' + item.id + '">' + item.content + '</div>';
				})
				.join('');

			return /* html */ `
				<div :class="classes()">
					<nav class="tabs">
						<a
							ot-for="item in items"
							:class="'tab' + (active === item.id ? ' active' : '') + (item.disabled ? ' disabled' : '')"
							:href="item.href || 'javascript:void(0)'"
							:target="item.target"
							ot-click="(event) => select(item, event)"
						>
							<i ot-if="item.icon">{{ item.icon }}</i>
							<span ot-if="item.label" class="label">{{ item.label }}</span>
							<span ot-if="item.count != null" class="count">{{ item.count }}</span>
						</a>
					</nav>
					<div ot-if="hasContent" class="body">
						<span ot-html="panels"></span>
					</div>
				</div>
			`;
		}
	});
});
