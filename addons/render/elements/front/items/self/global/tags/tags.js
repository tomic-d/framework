onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Filter tag group with single or multiple selection, icons, counts and color dots.',
		category: 'Global',
		author: 'OneType',
		config: {
			items: {
				type: 'array',
				value: [],
				each: {
					type: 'string|object',
					config: {
						id: { type: 'string' },
						label: { type: 'string' },
						icon: { type: 'string' },
						count: { type: 'string|number' },
						color: { type: 'string', options: ['brand', 'blue', 'red', 'orange', 'green'] },
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
				value: ['pills', 'size-m'],
				options: ['pills', 'outline', 'minimal', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.normalized = this.items.map(item =>
			{
				if(typeof item === 'string')
				{
					return { id: item, label: item };
				}

				return {
					id: item.id || item.label,
					label: item.label || item.id,
					icon: item.icon,
					count: item.count,
					color: item.color,
					disabled: item.disabled
				};
			});

			const styles = ['pills', 'outline', 'minimal'];
			const hasStyle = this.variant.some(v => styles.includes(v));

			if(!hasStyle)
			{
				this.variant = ['pills', ...this.variant];
			}

			this.isActive = (item) =>
			{
				if(Array.isArray(this.active))
				{
					return this.active.includes(item.id);
				}

				return this.active === item.id;
			};

			this.select = (item, event) =>
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
					next = item.id;
				}

				this.active = next;

				if(this._change)
				{
					this._change({ event, value: next });
				}
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<button
						ot-for="tag in normalized"
						type="button"
						:class="'tag' + (isActive(tag) ? ' active' : '') + (tag.disabled ? ' disabled' : '') + (tag.color ? ' color-' + tag.color : '')"
						ot-click="(event) => select(tag, event)"
					>
						<span ot-if="tag.color && !tag.icon" class="dot"></span>
						<i ot-if="tag.icon">{{ tag.icon }}</i>
						<span class="label">{{ tag.label }}</span>
						<span ot-if="tag.count != null" class="count">{{ tag.count }}</span>
					</button>
				</div>
			`;
		}
	});
});
