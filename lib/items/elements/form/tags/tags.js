onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Tag input with free-text entry or predefined options.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'array',
				value: [],
				each: {
					type: 'string'
				}
			},
			name: {
				type: 'string',
				value: ''
			},
			placeholder: {
				type: 'string',
				value: 'Add tag...'
			},
			options: {
				type: 'array',
				value: [],
				each: {
					type: 'string'
				}
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
			this.query = '';
			this.open = false;

			this.filtered = () =>
			{
				if (!this.options.length)
				{
					return [];
				}

				return this.options.filter(option =>
					!this.value.includes(option) &&
					(!this.query || option.toLowerCase().includes(this.query.toLowerCase()))
				);
			};

			this.add = (tag) =>
			{
				tag = tag.trim();

				if (!tag || this.disabled || this.value.includes(tag))
				{
					return;
				}

				this.value.push(tag);
				this.query = '';
				this.open = false;
				this.Update();

				if (this._change)
				{
					this._change(this.value);
				}
			};

			this.remove = (index) =>
			{
				if (this.disabled)
				{
					return;
				}

				this.value.splice(index, 1);
				this.Update();

				if (this._change)
				{
					this._change(this.value);
				}
			};

			this.input = (event, ctx) =>
			{
				this.query = ctx.value;
				this.open = this.query.length > 0 && this.filtered().length > 0;
				this.Update();
			};

			this.keydown = (event) =>
			{
				if (event.key === 'Enter')
				{
					event.preventDefault();

					if (this.open && this.filtered().length)
					{
						this.add(this.filtered()[0]);
					}
					else if (this.query.trim())
					{
						this.add(this.query);
					}
				}

				if (event.key === 'Backspace' && !this.query && this.value.length)
				{
					this.remove(this.value.length - 1);
				}
			};

			this.select = (option) =>
			{
				this.add(option);
			};

			this.close = () =>
			{
				this.open = false;
				this.Update();
			};

			return `
				<div :class="'holder ' + variant.join(' ')" ot-click-outside="close">
					<input type="hidden" :name="name" :value="value.join(',')" />
					<div class="tags">
						<span ot-for="tag, index in value" class="tag">
							<span class="text">{{ tag }}</span>
							<i ot-if="!disabled" class="remove" ot-click="() => remove(index)">close</i>
						</span>
						<input
							class="input"
							type="text"
							:value="query"
							:placeholder="value.length ? '' : placeholder"
							:disabled="disabled"
							autocomplete="off"
							ot-input="input"
							ot-keydown="keydown"
						/>
					</div>
					<div ot-if="open" class="dropdown">
						<div ot-for="option in filtered()" class="option" ot-click="() => select(option)">{{ option }}</div>
					</div>
				</div>
			`;
		}
	});
});
