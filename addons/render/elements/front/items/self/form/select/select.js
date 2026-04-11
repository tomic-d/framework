onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-select',
		icon: 'arrow_drop_down',
		name: 'Select',
		description: 'Premium custom dropdown select with search, keyboard navigation and clearable.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			placeholder: {
				type: 'string',
				value: 'Select…'
			},
			icon: {
				type: 'string'
			},
			options: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						value: { type: 'string' },
						icon: { type: 'string' },
						description: { type: 'string' },
						disabled: { type: 'boolean' }
					}
				}
			},
			searchable: {
				type: 'boolean'
			},
			clearable: {
				type: 'boolean'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.open = false;
			this.query = '';
			this.style = '';
			this.activeIndex = 0;

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
					this.Update();
					return;
				}

				if(event.key === 'ArrowUp')
				{
					event.preventDefault();
					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					this.Update();
					return;
				}

				if(event.key === 'Home')
				{
					event.preventDefault();
					this.activeIndex = 0;
					this.Update();
					return;
				}

				if(event.key === 'End')
				{
					event.preventDefault();
					this.activeIndex = Math.max(filtered.length - 1, 0);
					this.Update();
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

			this.close = () =>
			{
				this.open = false;
				this.query = '';
				this.activeIndex = 0;

				window.removeEventListener('scroll', this.handleScroll, true);
				window.removeEventListener('resize', this.close);
				window.removeEventListener('keydown', this.handleKey);

				this.Update();
			};

			this.toggle = (event) =>
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

				const filtered = this.filtered();
				const currentIndex = filtered.findIndex(o => o.value === this.value);
				this.activeIndex = currentIndex >= 0 ? currentIndex : 0;

				window.addEventListener('scroll', this.handleScroll, true);
				window.addEventListener('resize', this.close);
				window.addEventListener('keydown', this.handleKey);

				this.Update();

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
				this.Update();
			};

			this.dismiss = () =>
			{
				this.close();
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (open ? ' open' : '') + (disabled ? ' disabled' : '')" ot-click-outside="dismiss">
					<input type="hidden" :name="name" :value="value" />
					<div class="trigger" ot-click="toggle">
						<i ot-if="icon" class="icon">{{ icon }}</i>
						<i ot-if="!icon && current() && current().icon" class="icon">{{ current().icon }}</i>
						<span ot-if="value" class="selected">{{ current() ? current().label : '' }}</span>
						<span ot-if="!value" class="placeholder">{{ placeholder }}</span>
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
							<div ot-if="filtered().length === 0" class="empty">No results</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
