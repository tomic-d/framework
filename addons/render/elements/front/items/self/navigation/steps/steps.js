onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'navigation-steps',
		icon: 'format_list_numbered',
		name: 'Steps',
		description: 'Stepper navigation with done, active and upcoming states. Vertical or horizontal.',
		category: 'Navigation',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string' },
						label: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						disabled: { type: 'boolean' }
					}
				}
			},
			active: {
				type: 'string'
			},
			orientation: {
				type: 'string',
				value: 'vertical',
				options: ['vertical', 'horizontal']
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'border', 'connected', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'clean', 'connected', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
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

			this.select = (item, event) =>
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

			return /* html */ `
				<nav :class="'holder ' + orientation + ' ' + variant.join(' ')">
					<button
						ot-for="item in computed"
						type="button"
						:class="'step ' + item.status + (item.disabled ? ' disabled' : '')"
						ot-click="({ event }) => select(item, event)"
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
