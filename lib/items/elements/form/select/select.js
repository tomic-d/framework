onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-select',
		icon: 'arrow_drop_down',
		name: 'Select',
		description: 'Custom dropdown select with search support.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string',
				value: ''
			},
			name: {
				type: 'string',
				value: ''
			},
			placeholder: {
				type: 'string',
				value: 'Select...'
			},
			options: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string', value: '' },
						value: { type: 'string', value: '' },
						icon: { type: 'string', value: '' }
					}
				}
			},
			searchable: {
				type: 'boolean',
				value: false
			},
			disabled: {
				type: 'boolean',
				value: false
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

			this.current = () =>
			{
				return this.options.find(o => o.value === this.value);
			};

			this.filtered = () =>
			{
				if (!this.query)
				{
					return this.options;
				}

				return this.options.filter(o =>
					o.label.toLowerCase().includes(this.query.toLowerCase())
				);
			};

			this.handleScroll = (event) =>
			{
				if (event.target.closest && event.target.closest('.dropdown'))
				{
					return;
				}

				this.close();
			};

			this.close = () =>
			{
				this.open = false;
				this.query = '';
				window.removeEventListener('scroll', this.handleScroll, true);
				window.removeEventListener('resize', this.close);
				this.Update();
			};

			this.toggle = (event) =>
			{
				if (this.disabled)
				{
					return;
				}

				if (this.open)
				{
					this.close();
					return;
				}

				this.open = true;
				this.query = '';

				const rect = event.target.closest('.trigger').getBoundingClientRect();
				this.style = 'top: ' + (rect.bottom + 4) + 'px; left: ' + rect.left + 'px; width: ' + rect.width + 'px;';

				window.addEventListener('scroll', this.handleScroll, true);
				window.addEventListener('resize', this.close);

				this.Update();
			};

			this.select = (option) =>
			{
				this.value = option.value;
				this.close();

				if (this._change)
				{
					this._change(this.value);
				}
			};

			this.search = (e, ctx) =>
			{
				this.query = ctx.value;
				this.Update();
			};

			this.dismiss = () =>
			{
				this.close();
			};

			return `
				<div :class="'holder ' + variant.join(' ') + (open ? ' open' : '')" ot-click-outside="dismiss">
					<input type="hidden" :name="name" :value="value" />
					<div class="trigger" ot-click="toggle">
						<i ot-if="current() && current().icon" class="icon">{{ current().icon }}</i>
						<span ot-if="value" class="selected">{{ current() ? current().label : '' }}</span>
						<span ot-if="!value" class="placeholder">{{ placeholder }}</span>
						<i class="arrow">{{ open ? 'expand_less' : 'expand_more' }}</i>
					</div>
					<div ot-if="open" class="dropdown" :style="style">
						<div ot-if="searchable" class="search">
							<input type="text" :value="query" placeholder="Search..." autocomplete="off" ot-input="search" />
						</div>
						<div class="list">
							<div ot-for="option in filtered()" :class="'option' + (option.value === value ? ' active' : '')" ot-click="() => select(option)">
								<i ot-if="option.icon" class="icon">{{ option.icon }}</i>
								<span class="label">{{ option.label }}</span>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
