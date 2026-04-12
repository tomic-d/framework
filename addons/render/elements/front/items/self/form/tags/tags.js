onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Tag input with autocomplete, multi-select, color variants and keyboard navigation.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Selected tags.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Form field name.'
			},
			placeholder:
			{
				type: 'string',
				value: 'Add tag…',
				description: 'Input placeholder.'
			},
			options:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Suggestion list. Also used as selectable chips when mode is select.'
			},
			mode:
			{
				type: 'string',
				value: 'input',
				options: ['input', 'select'],
				description: 'Input mode: type to add, or click chips to toggle.'
			},
			max:
			{
				type: 'number',
				value: 0,
				description: 'Maximum number of tags. 0 = unlimited.'
			},
			minLength:
			{
				type: 'number',
				value: 0,
				description: 'Minimum character length per tag.'
			},
			restrict:
			{
				type: 'boolean',
				value: false,
				description: 'Only allow values from options.'
			},
			color:
			{
				type: 'string',
				value: '',
				options: ['', 'brand', 'blue', 'red', 'orange', 'green'],
				description: 'Tag chip color.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Container background.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Field size.'
			},
			variant:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				options: ['border'],
				description: 'Visual modifiers.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
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

			this.query = '';
			this.open = false;
			this.activeIndex = 0;
			this.shakeIndex = -1;
			this.isSelect = this.mode === 'select';

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				if(this.color)
				{
					list.push(this.color);
				}

				if(this.variant.includes('border'))
				{
					list.push('border');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			this.chipClass = (option) =>
			{
				const selected = this.value.includes(option);

				return 'chip' + (selected ? ' selected' : '');
			};

			/* ===== HELPERS ===== */

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

			/* ===== HANDLERS ===== */

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

			this.toggle = (option) =>
			{
				if(this.disabled)
				{
					return;
				}

				const index = this.value.indexOf(option);

				if(index !== -1)
				{
					this.value.splice(index, 1);
				}
				else
				{
					if(this.reachedMax())
					{
						return;
					}

					this.value.push(option);
				}

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

				if(filtered.length > 0 && !this.open)
				{
					this.openDropdown();
				}
				else if(filtered.length === 0 && this.open)
				{
					this.closeDropdown();
				}

				this.Update();
			};

			this.focus = () =>
			{
				const filtered = this.filtered();

				if(filtered.length > 0)
				{
					this.openDropdown();
				}
			};

			this.handleKey = (event) =>
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
						if(!this.open)
						{
							this.openDropdown();
						}

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
					event.preventDefault();
					this.closeDropdown();
					return;
				}
			};

			this.select = (option) =>
			{
				this.add(option);
			};

			this.openDropdown = () =>
			{
				if(this.open)
				{
					return;
				}

				this.open = true;
				this.Update();

				window.addEventListener('scroll', this.handleScroll, true);
				window.addEventListener('resize', this.closeDropdown);
			};

			this.closeDropdown = () =>
			{
				if(!this.open)
				{
					return;
				}

				this.open = false;
				this.query = '';
				this.activeIndex = 0;
				this.Update();

				window.removeEventListener('scroll', this.handleScroll, true);
				window.removeEventListener('resize', this.closeDropdown);
			};

			this.handleScroll = (event) =>
			{
				if(event.target.closest && event.target.closest('.dropdown'))
				{
					return;
				}

				this.closeDropdown();
			};

			this.dismiss = () =>
			{
				this.closeDropdown();
			};

			/* ===== RENDER ===== */

			if(this.isSelect)
			{
				return /* html */ `
					<div :class="classes()">
						<input type="hidden" :name="name" :value="value.join(',')" />
						<div class="chips">
							<button
								ot-for="option in options"
								type="button"
								:class="chipClass(option)"
								ot-click="() => toggle(option)"
								:disabled="disabled"
							>{{ option }}</button>
						</div>
					</div>
				`;
			}

			return /* html */ `
				<div :class="classes()" ot-click-outside="dismiss">
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
							ot-keydown="handleKey"
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
