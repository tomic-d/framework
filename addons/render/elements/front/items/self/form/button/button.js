onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-button',
		icon: 'smart_button',
		name: 'Button',
		description: 'Premium button with color, style, size, icon and loading state.',
		category: 'Form',
		config:
		{
			text:
			{
				type: 'string',
				value: '',
				description: 'Button label.'
			},
			icon:
			{
				type: 'string',
				value: '',
				description: 'Left icon name.'
			},
			iconRight:
			{
				type: 'string',
				value: '',
				description: 'Right icon name.'
			},
			href:
			{
				type: 'string',
				value: '',
				description: 'When set, renders as anchor.'
			},
			target:
			{
				type: 'string',
				value: '',
				options: ['', '_blank', '_self', '_parent', '_top'],
				description: 'Anchor target.'
			},
			type:
			{
				type: 'string',
				value: 'button',
				options: ['button', 'submit', 'reset'],
				description: 'Button type attribute.'
			},
			color:
			{
				type: 'string',
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green', 'dark'],
				description: 'Accent color. Pairs with style.'
			},
			tone:
			{
				type: 'string',
				value: 'solid',
				options: ['solid', 'soft', 'outline', 'ghost', 'link'],
				description: 'Visual tone.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'glass'],
				description: 'Background depth when no color set.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Button size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['full', 'rounded', 'icon-only'],
				description: 'Visual modifiers.'
			},
			tooltip:
			{
				type: 'string',
				value: '',
				description: 'Tooltip text shown on hover.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			loading:
			{
				type: 'boolean',
				value: false,
				description: 'Loading state with spinner.'
			},
			_click:
			{
				type: 'function',
				description: 'Click handler. Receives { event }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.iconOnly = this.variant.includes('icon-only');
				this.hasText = !!this.text && !this.iconOnly;
				this.isLink = !!this.href;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.tone, 'size-' + this.size];

				if(this.color)
				{
					list.push(this.color);
				}
				else if(this.background)
				{
					list.push(this.background);
				}

				if(this.variant.includes('full'))
				{
					list.push('full');
				}

				if(this.variant.includes('rounded'))
				{
					list.push('rounded');
				}

				if(this.iconOnly)
				{
					list.push('icon-only');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				if(this.loading)
				{
					list.push('loading');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.click = ({ event }) =>
			{
				if(this.disabled || this.loading)
				{
					return;
				}

				if(this._click)
				{
					this._click({ event });
				}
			};

			/* ===== RENDER ===== */

			const body = /* html */ `
				<span ot-if="loading" class="spin"><i>progress_activity</i></span>
				<span ot-if="!loading" class="body">
					<i ot-if="icon" class="left">{{ icon }}</i>
					<span ot-if="hasText" class="text">{{ text }}</span>
					<i ot-if="iconRight" class="right">{{ iconRight }}</i>
				</span>
			`;

			if(this.isLink)
			{
				return /* html */ `
					<a :class="classes()" :href="href" :target="target || null" :ot-tooltip="tooltip ? { text: tooltip, position: { x: 'center', y: 'top' } } : null" ot-click="click">
						${body}
					</a>
				`;
			}

			return /* html */ `
				<button :class="classes()" :type="type" :disabled="disabled" :ot-tooltip="tooltip ? { text: tooltip, position: { x: 'center', y: 'top' } } : null" ot-click="click">
					${body}
				</button>
			`;
		}
	});
});
