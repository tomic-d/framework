onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Premium tag input with autocomplete, color variants, max limit and keyboard navigation.',
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
				type: 'string'
			},
			placeholder: {
				type: 'string',
				value: 'Add tag…'
			},
			options: {
				type: 'array',
				value: [],
				each: {
					type: 'string'
				}
			},
			max: {
				type: 'number'
			},
			minLength: {
				type: 'number'
			},
			restrict: {
				type: 'boolean'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: [
					'bg-1', 'bg-2', 'bg-3', 'bg-4',
					'transparent', 'border',
					'color-brand', 'color-blue', 'color-red', 'color-orange', 'color-green',
					'size-s', 'size-m', 'size-l'
				]
			},
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			this.query = '';
			this.open = false;
			this.activeIndex = 0;
			this.shakeIndex = -1;

			this.reachedMax = () =>
			{
				return this.max > 0 && this.value.length >= this.max;
			};

			this.filtered = () =>
			{
				if(!this.options || !this.options.length)
				{
					return [];
				}

				const query = this.query.toLowerCase();

				return this.options.filter(option =>
				{
					if(this.value.includes(option))
					{
						return false;
					}

					if(!query)
					{
						return true;
					}

					return option.toLowerCase().includes(query);
				});
			};

			this.add = (tag) =>
			{
				if(this.disabled)
				{
					return;
				}

				tag = String(tag || '').trim();

				if(!tag)
				{
					return;
				}

				if(this.minLength && tag.length < this.minLength)
				{
					return;
				}

				if(this.reachedMax())
				{
					return;
				}

				if(this.restrict && !this.options.includes(tag))
				{
					return;
				}

				const existing = this.value.indexOf(tag);

				if(existing !== -1)
				{
					this.shakeIndex = existing;
					this.Update();

					setTimeout(() =>
					{
						this.shakeIndex = -1;
						this.Update();
					}, 400);

					return;
				}

				this.value.push(tag);
				this.query = '';
				this.activeIndex = 0;
				this.open = false;
				this.Update();

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.remove = (index) =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value.splice(index, 1);
				this.Update();

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.input = ({ value }) =>
			{
				this.query = value;
				this.activeIndex = 0;

				const filtered = this.filtered();
				this.open = filtered.length > 0;
				this.Update();
			};

			this.focus = () =>
			{
				const filtered = this.filtered();

				if(filtered.length > 0)
				{
					this.open = true;
					this.Update();
				}
			};

			this.keydown = ({ event }) =>
			{
				const filtered = this.filtered();

				if(event.key === 'Enter')
				{
					event.preventDefault();

					if(this.open && filtered.length > 0)
					{
						this.add(filtered[this.activeIndex] || filtered[0]);
					}
					else if(this.query.trim() && !this.restrict)
					{
						this.add(this.query);
					}

					return;
				}

				if(event.key === 'Backspace' && !this.query && this.value.length)
				{
					this.remove(this.value.length - 1);
					return;
				}

				if(event.key === 'ArrowDown')
				{
					event.preventDefault();

					if(filtered.length > 0)
					{
						this.open = true;
						this.activeIndex = Math.min(this.activeIndex + 1, filtered.length - 1);
						this.Update();
					}

					return;
				}

				if(event.key === 'ArrowUp')
				{
					event.preventDefault();

					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					this.Update();
					return;
				}

				if(event.key === 'Escape')
				{
					this.open = false;
					this.Update();
					return;
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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')" ot-click-outside="close">
					<input type="hidden" :name="name" :value="value.join(',')" />
					<div class="field">
						<span ot-for="tag, index in value" :class="'tag' + (shakeIndex === index ? ' shake' : '')">
							<span class="text">{{ tag }}</span>
							<button ot-if="!disabled" type="button" class="remove" ot-click="() => remove(index)">
								<i>close</i>
							</button>
						</span>
						<input
							ot-if="!reachedMax()"
							class="input"
							type="text"
							:value="query"
							:placeholder="value.length ? '' : placeholder"
							:disabled="disabled"
							autocomplete="off"
							spellcheck="false"
							ot-input="input"
							ot-keydown="keydown"
							ot-focus="focus"
						/>
					</div>
					<div ot-if="open" class="dropdown">
						<button
							ot-for="option, index in filtered()"
							type="button"
							:class="'option' + (activeIndex === index ? ' active' : '')"
							ot-click="() => select(option)"
						>{{ option }}</button>
					</div>
				</div>
			`;
		}
	});
});
