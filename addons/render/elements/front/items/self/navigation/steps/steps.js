onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-steps',
		icon: 'format_list_numbered',
		name: 'Steps',
		description: 'Stepper navigation with done, active and upcoming states.',
		category: 'Navigation',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				description: 'Step items.',
				each:
				{
					type: 'object',
					config:
					{
						id:
						{
							type: 'string',
							description: 'Unique step identifier.'
						},
						label:
						{
							type: 'string',
							description: 'Step label.'
						},
						description:
						{
							type: 'string',
							description: 'Step description.'
						},
						icon:
						{
							type: 'string',
							description: 'Icon for upcoming state.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Prevent selection.'
						}
					}
				}
			},
			active:
			{
				type: 'string',
				value: '',
				description: 'Active step id.'
			},
			orientation:
			{
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal'],
				description: 'Layout direction.'
			},
			background:
			{
				type: 'string',
				value: 'bg-1',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Background depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Step size.'
			},
			variant:
			{
				type: 'array',
				value: ['border', 'connected'],
				each: { type: 'string' },
				options: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'clean', 'connected'],
				description: 'Visual modifiers.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.rebuild = () =>
			{
				this.activeIndex = this.items.findIndex(entry => entry.id === this.active);

				this.computed = this.items.map((entry, index) =>
				{
					let status = 'upcoming';

					if(this.activeIndex !== -1)
					{
						if(index < this.activeIndex)
						{
							status = 'done';
						}
						else if(index === this.activeIndex)
						{
							status = 'active';
						}
					}

					return {
						...entry,
						index,
						status,
						number: index + 1
					};
				});
			};

			this.rebuild();

			/* ===== CLASSES ===== */

			this.Compute(() =>
			{
				this.classes = ['box', this.orientation, this.background, 'size-' + this.size].concat(this.variant).join(' ');
			});

			/* ===== HANDLERS ===== */

			this.select = ({ event }, item) =>
			{
				if(item.disabled)
				{
					return;
				}

				this.active = item.id;
				this.rebuild();

				if(this._change)
				{
					this._change({ event, value: item.id });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<nav :class="classes">
					<button
						ot-for="item in computed"
						type="button"
						:class="'step ' + item.status + (item.disabled ? ' disabled' : '')"
						ot-click="(event) => select(event, item)"
					>
						<span class="marker">
							<i ot-if="item.status === 'done'">check</i>
							<i ot-if="item.status !== 'done' && item.icon">{{ item.icon }}</i>
							<span ot-if="item.status !== 'done' && !item.icon" class="number">{{ item.number }}</span>
						</span>
						<span class="text">
							<span class="label">{{ item.label }}</span>
							<span ot-if="item.description" class="description">{{ item.description }}</span>
						</span>
					</button>
				</nav>
			`;
		}
	});
});
