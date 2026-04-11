onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-textarea',
		icon: 'notes',
		name: 'Textarea',
		description: 'Premium multi-line text input with auto-resize, character counter and focus ring.',
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
				type: 'string'
			},
			rows: {
				type: 'number',
				value: 4
			},
			minRows: {
				type: 'number'
			},
			maxRows: {
				type: 'number'
			},
			maxlength: {
				type: 'number'
			},
			autoResize: {
				type: 'boolean'
			},
			counter: {
				type: 'boolean'
			},
			resize: {
				type: 'string',
				value: 'vertical',
				options: ['none', 'vertical', 'horizontal', 'both']
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
			this.length = (this.value || '').length;
			this.showCounter = this.counter && this.maxlength > 0;

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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
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
