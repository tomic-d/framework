onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'global-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Filter tag group with single or multi selection, icons, counts and color dots.',
		category: 'Global',
		config:
		{
			items:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'string|object',
					config:
					{
						id:
						{
							type: 'string',
							description: 'Unique tag identifier.'
						},
						label:
						{
							type: 'string',
							description: 'Display text.'
						},
						icon:
						{
							type: 'string',
							description: 'Material icon name.'
						},
						count:
						{
							type: 'string|number',
							description: 'Count badge value.'
						},
						color:
						{
							type: 'string',
							options: ['brand', 'blue', 'red', 'orange', 'green'],
							description: 'Color dot accent.'
						},
						disabled:
						{
							type: 'boolean',
							description: 'Disabled state.'
						}
					}
				},
				description: 'Tag items. Strings or { id, label, icon, count, color, disabled }.'
			},
			active:
			{
				type: 'string|array',
				description: 'Active tag id or array of ids for multi.'
			},
			multiple:
			{
				type: 'boolean',
				value: false,
				description: 'Allow multiple selection.'
			},
			tone:
			{
				type: 'string',
				value: 'pills',
				options: ['pills', 'outline', 'minimal'],
				description: 'Visual tone.'
			},
			background:
			{
				type: 'string',
				value: '',
				options: ['', 'bg-1', 'bg-2', 'bg-3', 'bg-4'],
				description: 'Tag surface depth.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Tag size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			},
			_change:
			{
				type: 'function',
				description: 'Selection handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
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
			});

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

				return list.join(' ');
			};

			this.tagClass = (tag) =>
			{
				const list = ['tag'];

				if(this.isActive(tag))
				{
					list.push('active');
				}

				if(tag.disabled)
				{
					list.push('disabled');
				}

				if(tag.color)
				{
					list.push('color-' + tag.color);
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

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
					next = this.active === item.id ? null : item.id;
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
					<button
						ot-for="tag in normalized"
						type="button"
						:class="tagClass(tag)"
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
