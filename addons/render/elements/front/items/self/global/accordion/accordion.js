onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-accordion',
		icon: 'expand_more',
		name: 'Accordion',
		description: 'Expandable panel list with icons, descriptions, single or multiple open mode.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						id: { type: 'string' },
						title: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						content: { type: 'string' },
						disabled: { type: 'boolean' }
					}
				}
			},
			active: {
				type: 'string|array'
			},
			multiple: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['rows', 'size-m'],
				options: ['rows', 'cards', 'minimal', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			const styles = ['rows', 'cards', 'minimal'];
			const hasStyle = this.variant.some(v => styles.includes(v));

			if(!hasStyle)
			{
				this.variant = ['rows', ...this.variant];
			}

			this.normalized = this.items.map((item, index) => ({
				id: item.id || String(index),
				title: item.title || '',
				description: item.description,
				icon: item.icon,
				content: item.content || '',
				disabled: !!item.disabled
			}));

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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
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
