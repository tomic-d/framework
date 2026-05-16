onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-select',
		icon: 'arrow_drop_down',
		name: 'Select',
		description: 'Custom dropdown select with search, keyboard navigation and clearable.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string|number',
				description: 'Selected value.'
			},
			name:
			{
				type: 'string',
				description: 'Hidden input name for forms.'
			},
			placeholder:
			{
				type: 'string',
				value: 'Select…',
				description: 'Placeholder text.'
			},
			icon:
			{
				type: 'string',
				description: 'Left icon on trigger.'
			},
			options:
			{
				type: 'array|function',
				value: [],
				each: { type: 'object|string|number' },
				description: 'List of options or async function returning options. Strings/numbers auto-wrap to { label, value }.'
			},
			searchable:
			{
				type: 'boolean',
				value: false,
				description: 'Show search input in dropdown.'
			},
			clearable:
			{
				type: 'boolean',
				value: false,
				description: 'Show clear button when value set.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Background depth.'
			},
			variant:
			{
				type: 'array',
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
				description: 'Visual modifiers.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Trigger size.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.open = false;
			this.above = false;
			this.query = '';
			this.activeIndex = 0;
			this.loading = false;

			this.normalize = (list) =>
			{
				return list.map(option =>
				{
					if(typeof option === 'object' && option !== null)
					{
						return option;
					}

					return { label: String(option), value: option };
				});
			};

			/* ===== ASYNC OPTIONS ===== */

			if(typeof this.options === 'function')
			{
				const callback = this.options;

				this.options = [];
				this.loading = true;

				this.OnInit(async () =>
				{
					try
					{
						const result = await callback.call(this);
						this.options = Array.isArray(result) ? this.normalize(result) : [];
					}
					catch(error)
					{
						this.options = [];
					}

					this.loading = false;
					this.Update();
				});
			}
			else
			{
				this.options = this.normalize(this.options);
			}

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', 'size-' + this.size];

				if(this.background)
				{
					list.push(this.background);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.variant.includes('border-bottom'))
				{
					list.push('border-bottom');
				}

				if(this.open)
				{
					list.push('open');
				}

				if(this.above)
				{
					list.push('above');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.current = () =>
			{
				return this.options.find(o => o.value === this.value);
			};

			this.filtered = () =>
			{
				if(!this.query)
				{
					return this.options;
				}

				return this.options.filter(o =>
					String(o.label || '').toLowerCase().includes(this.query.toLowerCase())
				);
			};

			/* ===== HANDLERS ===== */

			this.toggle = () =>
			{
				if(this.disabled)
				{
					return;
				}

				if(this.open)
				{
					this.close();
					return;
				}

				this.open = true;
				this.query = '';

				const box = this.Element.querySelector('.box');
				const rect = box.getBoundingClientRect();
				const space = window.innerHeight - rect.bottom;

				this.above = space < 320;

				const filtered = this.filtered();
				const currentIndex = filtered.findIndex(o => o.value === this.value);

				this.activeIndex = currentIndex >= 0 ? currentIndex : 0;

				window.addEventListener('scroll', this.handleScroll, true);
				window.addEventListener('resize', this.close);
				window.addEventListener('keydown', this.handleKey);

				if(this.searchable)
				{
					setTimeout(() =>
					{
						const search = this.Element?.querySelector('.search > input');

						if(search)
						{
							search.focus();
						}
					}, 10);
				}
			};

			this.close = () =>
			{
				this.open = false;
				this.above = false;
				this.query = '';
				this.activeIndex = 0;

				window.removeEventListener('scroll', this.handleScroll, true);
				window.removeEventListener('resize', this.close);
				window.removeEventListener('keydown', this.handleKey);
			};

			this.select = (option) =>
			{
				if(option.disabled)
				{
					return;
				}

				this.value = option.value;
				this.close();

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.clear = () =>
			{
				this.value = '';

				if(this._change)
				{
					this._change({ value: '' });
				}
			};

			this.search = ({ value }) =>
			{
				this.query = value;
				this.activeIndex = 0;
			};

			this.dismiss = () =>
			{
				this.close();
			};

			this.handleScroll = (event) =>
			{
				if(event.target.closest && event.target.closest('.dropdown'))
				{
					return;
				}

				this.close();
			};

			this.handleKey = (event) =>
			{
				if(!this.open)
				{
					return;
				}

				const filtered = this.filtered();

				if(event.key === 'Escape')
				{
					event.preventDefault();
					this.close();
					return;
				}

				if(event.key === 'ArrowDown')
				{
					event.preventDefault();
					this.activeIndex = Math.min(this.activeIndex + 1, filtered.length - 1);
					return;
				}

				if(event.key === 'ArrowUp')
				{
					event.preventDefault();
					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					return;
				}

				if(event.key === 'Home')
				{
					event.preventDefault();
					this.activeIndex = 0;
					return;
				}

				if(event.key === 'End')
				{
					event.preventDefault();
					this.activeIndex = Math.max(filtered.length - 1, 0);
					return;
				}

				if(event.key === 'Enter')
				{
					event.preventDefault();

					if(filtered[this.activeIndex])
					{
						this.select(filtered[this.activeIndex]);
					}

					return;
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()" ot-click-outside="dismiss">
					<input type="hidden" :name="name" :value="value" />
					<div class="trigger" ot-click="toggle">
						<i ot-if="icon" class="icon">{{ icon }}</i>
						<i ot-if="!icon && current() && current().icon" class="icon">{{ current().icon }}</i>
						<span ot-if="current()" class="selected">{{ current().label }}</span>
						<span ot-if="!current() && !loading" class="placeholder">{{ placeholder }}</span>
						<span ot-if="loading" class="placeholder">Loading…</span>
						<button
							ot-if="clearable && value && !disabled"
							type="button"
							class="action"
							ot-click.stop="clear"
							:ot-tooltip="{ text: 'Clear', position: { x: 'center', y: 'top' } }"
						>
							<i>close</i>
						</button>
						<i class="arrow">expand_more</i>
					</div>
					<div ot-if="open" class="dropdown">
						<div ot-if="searchable" class="search">
							<i>search</i>
							<input type="text" :value="query" placeholder="Search…" autocomplete="off" ot-input="search" />
						</div>
						<div class="list">
							<button
								ot-for="option, index in filtered()"
								type="button"
								:class="'option' + (option.value === value ? ' selected' : '') + (activeIndex === index ? ' active' : '') + (option.disabled ? ' disabled' : '')"
								ot-click="() => select(option)"
							>
								<i ot-if="option.icon" class="icon">{{ option.icon }}</i>
								<span class="text">
									<span class="label">{{ option.label }}</span>
									<span ot-if="option.description" class="description">{{ option.description }}</span>
								</span>
								<i ot-if="option.value === value" class="check">check</i>
							</button>
							<div ot-if="filtered().length === 0 && !loading" class="empty">No results</div>
							<div ot-if="loading" class="empty">Loading…</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});