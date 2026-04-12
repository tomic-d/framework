onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-input',
		icon: 'input',
		name: 'Input',
		description: 'Text input with icons, prefix/suffix, password toggle, clearable and autocomplete.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string|number',
				description: 'Input value.'
			},
			name:
			{
				type: 'string',
				description: 'Input name attribute.'
			},
			type:
			{
				type: 'string',
				value: 'text',
				options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
				description: 'Input type.'
			},
			placeholder:
			{
				type: 'string',
				description: 'Placeholder text.'
			},
			icon:
			{
				type: 'string',
				description: 'Left icon.'
			},
			iconRight:
			{
				type: 'string',
				description: 'Right icon.'
			},
			prefix:
			{
				type: 'string',
				description: 'Static text before value.'
			},
			suffix:
			{
				type: 'string',
				description: 'Static text after value.'
			},
			options:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Autocomplete suggestions.'
			},
			restrict:
			{
				type: 'boolean',
				value: false,
				description: 'Only allow values from options.'
			},
			clearable:
			{
				type: 'boolean',
				value: false,
				description: 'Show clear button when value present.'
			},
			maxlength:
			{
				type: 'number',
				description: 'Maximum character count.'
			},
			min:
			{
				type: 'number',
				description: 'Minimum value for number input.'
			},
			max:
			{
				type: 'number',
				description: 'Maximum value for number input.'
			},
			step:
			{
				type: 'number',
				description: 'Step increment for number input.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			readonly:
			{
				type: 'boolean',
				value: false,
				description: 'Readonly state.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Background depth.'
			},
			border:
			{
				type: 'boolean',
				value: true,
				description: 'Show border.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Input size.'
			},
			_input:
			{
				type: 'function',
				description: 'Input handler. Receives { event, value }.'
			},
			_change:
			{
				type: 'function',
				description: 'Change handler. Receives { event, value }.'
			},
			_focus:
			{
				type: 'function',
				description: 'Focus handler. Receives { event, value }.'
			},
			_blur:
			{
				type: 'function',
				description: 'Blur handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.open = false;
			this.activeIndex = 0;
			this.revealed = false;
			this.hasOptions = this.options && this.options.length > 0;
			this.isPassword = this.type === 'password';

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

				if(this.border)
				{
					list.push('border');
				}

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.inputType = () =>
			{
				if(this.isPassword && this.revealed)
				{
					return 'text';
				}

				return this.type || 'text';
			};

			this.filtered = () =>
			{
				if(!this.hasOptions)
				{
					return [];
				}

				const query = (this.value || '').toLowerCase();

				if(!query)
				{
					return this.options;
				}

				return this.options.filter(option => String(option).toLowerCase().includes(query));
			};

			/* ===== HANDLERS ===== */

			this.input = ({ event, value }) =>
			{
				this.value = value;
				this.activeIndex = 0;

				if(this.hasOptions)
				{
					const filtered = this.filtered();
					this.open = filtered.length > 0;
				}

				if(this._input)
				{
					this._input({ event, value });
				}
			};

			this.change = ({ event, value }) =>
			{
				if(this.restrict && this.hasOptions && !this.options.includes(value))
				{
					this.value = '';

					if(this._change)
					{
						this._change({ event, value: '' });
					}

					return;
				}

				this.value = value;

				if(this._change)
				{
					this._change({ event, value });
				}
			};

			this.focus = ({ event, value }) =>
			{
				if(this.hasOptions)
				{
					const filtered = this.filtered();

					if(filtered.length > 0)
					{
						this.open = true;
					}
				}

				if(this._focus)
				{
					this._focus({ event, value });
				}
			};

			this.blur = ({ event, value }) =>
			{
				if(this._blur)
				{
					this._blur({ event, value });
				}
			};

			this.keydown = ({ event }) =>
			{
				if(!this.hasOptions)
				{
					return;
				}

				const filtered = this.filtered();

				if(event.key === 'Enter')
				{
					if(this.open && filtered.length > 0)
					{
						event.preventDefault();
						this.select(filtered[this.activeIndex] || filtered[0]);
					}

					return;
				}

				if(event.key === 'ArrowDown')
				{
					event.preventDefault();

					if(filtered.length > 0)
					{
						this.open = true;
						this.activeIndex = Math.min(this.activeIndex + 1, filtered.length - 1);
					}

					return;
				}

				if(event.key === 'ArrowUp')
				{
					event.preventDefault();
					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					return;
				}

				if(event.key === 'Escape')
				{
					this.open = false;
					return;
				}
			};

			this.select = (option) =>
			{
				this.value = option;
				this.open = false;
				this.activeIndex = 0;

				if(this._change)
				{
					this._change({ event: null, value: option });
				}
			};

			this.close = () =>
			{
				this.open = false;
			};

			this.clear = () =>
			{
				this.value = '';
				this.open = false;

				if(this._change)
				{
					this._change({ event: null, value: '' });
				}
			};

			this.togglePassword = () =>
			{
				this.revealed = !this.revealed;
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()" ot-click-outside="close">
					<div class="field">
						<i ot-if="icon" class="icon">{{ icon }}</i>
						<span ot-if="prefix" class="affix">{{ prefix }}</span>
						<input
							class="input"
							:value="value"
							:type="inputType()"
							:placeholder="placeholder"
							:name="name"
							:maxlength="maxlength"
							:min="min"
							:max="max"
							:step="step"
							:disabled="disabled"
							:readonly="readonly"
							autocomplete="off"
							ot-input="input"
							ot-change="change"
							ot-focus="focus"
							ot-blur="blur"
							ot-keydown="keydown"
						/>
						<span ot-if="suffix" class="affix">{{ suffix }}</span>
						<button
							ot-if="clearable && value && !disabled && !readonly"
							type="button"
							class="action"
							ot-click.stop="clear"
							:ot-tooltip="{ text: 'Clear', position: { x: 'center', y: 'top' } }"
						>
							<i>close</i>
						</button>
						<button
							ot-if="isPassword && !disabled"
							type="button"
							class="action"
							ot-click.stop="togglePassword"
							:ot-tooltip="{ text: revealed ? 'Hide' : 'Show', position: { x: 'center', y: 'top' } }"
						>
							<i ot-if="!revealed">visibility</i>
							<i ot-if="revealed">visibility_off</i>
						</button>
						<i ot-if="iconRight" class="icon">{{ iconRight }}</i>
					</div>
					<div ot-if="open && hasOptions" class="dropdown">
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
