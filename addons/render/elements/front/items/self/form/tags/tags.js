onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-tags',
		icon: 'label',
		name: 'Tags',
		description: 'Tag input with autocomplete, multi-select, async options and keyboard navigation.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'array',
				value: [],
				each: { type: 'string|number' },
				description: 'Selected tag values.'
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
				type: 'array|function',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						label: { type: 'string', description: 'Display text.' },
						value: { type: 'string|number', description: 'Option value.' },
						icon: { type: 'string', description: 'Option icon.' },
						description: { type: 'string', description: 'Secondary text.' },
						disabled: { type: 'boolean', description: 'Disabled option.' }
					}
				},
				description: 'Array of {label, value} objects or async function returning the same.'
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
			searchable:
			{
				type: 'boolean',
				value: true,
				description: 'Show search dropdown in select mode.'
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
				value: ['border'],
				each: { type: 'string' },
				options: ['border', 'border-bottom'],
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
			this.above = false;
			this.activeIndex = 0;
			this.shakeIndex = -1;
			this.loading = false;
			this.isSelect = this.mode === 'select';

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
						this.options = Array.isArray(result) ? result : [];
					}
					catch(error)
					{
						this.options = [];
					}

					this.loading = false;
					this.Update();
				});
			}

			/* ===== HELPERS ===== */

			this.labelOf = (value) =>
			{
				const found = this.options.find(o => o.value === value);

				return found ? found.label : String(value);
			};

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

				if(this.variant.includes('border-bottom'))
				{
					list.push('border-bottom');
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

			this.chipClass = (option) =>
			{
				const selected = this.value.includes(option.value);

				return 'chip' + (selected ? ' selected' : '');
			};

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
					if(this.value.includes(option.value))
					{
						return false;
					}

					if(!query)
					{
						return true;
					}

					return String(option.label || '').toLowerCase().includes(query);
				});
			};

			/* ===== HANDLERS ===== */

			this.add = (option) =>
			{
				if(this.disabled)
				{
					return;
				}

				if(!option || option.disabled)
				{
					return;
				}

				if(this.reachedMax())
				{
					return;
				}

				const existing = this.value.indexOf(option.value);

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

				this.value.push(option.value);
				this.query = '';
				this.activeIndex = 0;
				this.open = false;
				this.Update();

				if(this._change)
				{
					this._change({ value: this.value });
				}
			};

			this.addRaw = (text) =>
			{
				if(this.disabled || this.restrict)
				{
					return;
				}

				text = String(text || '').trim();

				if(!text)
				{
					return;
				}

				if(this.minLength && text.length < this.minLength)
				{
					return;
				}

				if(this.reachedMax())
				{
					return;
				}

				if(this.value.includes(text))
				{
					return;
				}

				this.value.push(text);
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
				if(this.disabled || option.disabled)
				{
					return;
				}

				const index = this.value.indexOf(option.value);

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

					this.value.push(option.value);
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
						this.addRaw(this.query);
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

			this.openDropdown = () =>
			{
				if(this.open)
				{
					return;
				}

				const box = this.Element.querySelector('.box');
				const rect = box.getBoundingClientRect();
				const space = window.innerHeight - rect.bottom;

				this.above = space < 320;
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
				this.above = false;
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
						<div ot-if="loading" class="empty">Loading…</div>
						<div ot-if="!loading" class="chips">
							<span ot-if="!options.length" class="placeholder">{{ placeholder }}</span>
							<button
								ot-for="option in options"
								type="button"
								:class="chipClass(option)"
								ot-click="() => toggle(option)"
								:disabled="disabled || option.disabled"
							>
								<i ot-if="option.icon">{{ option.icon }}</i>
								<span>{{ option.label }}</span>
							</button>
						</div>
					</div>
				`;
			}

			return /* html */ `
				<div :class="classes()" ot-click-outside="dismiss">
					<input type="hidden" :name="name" :value="value.join(',')" />
					<div class="field">
						<span ot-for="tag, index in value" :class="'tag' + (shakeIndex === index ? ' shake' : '')">
							<span class="text">{{ labelOf(tag) }}</span>
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
							ot-click="() => add(option)"
						>
							<i ot-if="option.icon">{{ option.icon }}</i>
							<span class="label">{{ option.label }}</span>
							<span ot-if="option.description" class="description">{{ option.description }}</span>
						</button>
					</div>
				</div>
			`;
		}
	});
});