onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-textarea',
		icon: 'notes',
		name: 'Textarea',
		description: 'Multi-line text input with auto-resize, character counter and focus ring.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'Current value.'
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
				value: '',
				description: 'Placeholder text.'
			},
			rows:
			{
				type: 'number',
				value: 4,
				description: 'Initial visible rows.'
			},
			minRows:
			{
				type: 'number',
				description: 'Minimum rows for auto-resize.'
			},
			maxRows:
			{
				type: 'number',
				description: 'Maximum rows for auto-resize.'
			},
			maxlength:
			{
				type: 'number',
				description: 'Maximum character count.'
			},
			autoResize:
			{
				type: 'boolean',
				value: false,
				description: 'Grow height with content.'
			},
			counter:
			{
				type: 'boolean',
				value: false,
				description: 'Show character counter.'
			},
			resize:
			{
				type: 'string',
				value: 'vertical',
				options: ['none', 'vertical', 'horizontal', 'both'],
				description: 'CSS resize handle.'
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
				description: 'Textarea size.'
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

			this.length = (this.value || '').length;

			this.Compute(() =>
			{
				this.showCounter = this.counter && this.maxlength > 0;
			});

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

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HANDLERS ===== */

			this.resizeTextarea = () =>
			{
				if(!this.autoResize)
				{
					return;
				}

				const textarea = this.Element?.querySelector('textarea');

				if(!textarea)
				{
					return;
				}

				textarea.style.height = 'auto';

				const minRows = this.minRows || this.rows || 2;
				const maxRows = this.maxRows || 0;
				const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 22;

				const minHeight = minRows * lineHeight;
				const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
				const scrollHeight = textarea.scrollHeight;

				const next = Math.max(minHeight, Math.min(scrollHeight, maxHeight));

				textarea.style.height = next + 'px';
				textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
			};

			this.OnReady(() =>
			{
				this.resizeTextarea();
			});

			this.input = ({ event, value }) =>
			{
				this.value = value;
				this.length = value.length;
				this.resizeTextarea();

				if(this._input)
				{
					this._input({ event, value });
				}
			};

			this.change = ({ event, value }) =>
			{
				this.value = value;
				this.length = value.length;

				if(this._change)
				{
					this._change({ event, value });
				}
			};

			this.focus = ({ event, value }) =>
			{
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

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<textarea
						:placeholder="placeholder"
						:name="name"
						:rows="rows"
						:maxlength="maxlength"
						:disabled="disabled"
						:readonly="readonly"
						:style="'resize: ' + (autoResize ? 'none' : resize)"
						autocomplete="off"
						ot-input="input"
						ot-change="change"
						ot-focus="focus"
						ot-blur="blur"
					>{{ value }}</textarea>
					<div ot-if="showCounter" class="counter">
						<span :class="length >= maxlength ? 'full' : ''">{{ length }}</span>
						<span class="slash">/</span>
						<span>{{ maxlength }}</span>
					</div>
				</div>
			`;
		}
	});
});
