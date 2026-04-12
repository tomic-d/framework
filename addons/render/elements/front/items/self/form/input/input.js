onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-input',
		icon: 'input',
		name: 'Input',
		description: 'Premium text input with icons, prefix/suffix, password toggle, clearable and autocomplete dropdown.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string|number'
			},
			name: {
				type: 'string'
			},
			type: {
				type: 'string',
				value: 'text',
				options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search']
			},
			placeholder: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			iconRight: {
				type: 'string'
			},
			prefix: {
				type: 'string'
			},
			suffix: {
				type: 'string'
			},
			options: {
				type: 'array',
				value: [],
				each: {
					type: 'string'
				}
			},
			restrict: {
				type: 'boolean'
			},
			clearable: {
				type: 'boolean'
			},
			maxlength: {
				type: 'number'
			},
			min: {
				type: 'number'
			},
			max: {
				type: 'number'
			},
			step: {
				type: 'number'
			},
			disabled: {
				type: 'boolean'
			},
			readonly: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['bg-2', 'border', 'size-m'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent', 'border', 'size-s', 'size-m', 'size-l']
			},
			_input: {
				type: 'function'
			},
			_change: {
				type: 'function'
			},
			_focus: {
				type: 'function'
			},
			_blur: {
				type: 'function'
			}
		},
		render: function()
		{
			this.open = false;
			this.activeIndex = 0;
			this.revealed = false;
			this.hasOptions = this.options && this.options.length > 0;
			this.isPassword = this.type === 'password';

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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')" ot-click-outside="close">
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
