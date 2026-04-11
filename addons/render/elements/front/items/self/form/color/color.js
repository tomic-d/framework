onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-color',
		icon: 'palette',
		name: 'Color',
		description: 'Premium color picker with native input, hex validation, presets and copy action.',
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
				value: '#000000'
			},
			presets: {
				type: 'array',
				value: [],
				each: {
					type: 'string'
				}
			},
			disabled: {
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
			}
		},
		render: function()
		{
			this.copied = false;
			this.hasPresets = this.presets && this.presets.length > 0;

			this.normalize = (value) =>
			{
				if(!value)
				{
					return '';
				}

				let hex = String(value).trim().replace(/[^#0-9a-fA-F]/g, '');

				if(hex && hex.charAt(0) !== '#')
				{
					hex = '#' + hex;
				}

				return hex.slice(0, 7);
			};

			this.isValid = (value) =>
			{
				return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
			};

			this.sync = () =>
			{
				const input = this.Element?.querySelector('input.input');
				const native = this.Element?.querySelector('input.native');

				if(input)
				{
					input.value = this.value || '';
				}

				if(native && this.isValid(this.value))
				{
					native.value = this.value;
				}
			};

			this.pick = ({ event, value }) =>
			{
				this.value = value;
				this.sync();

				if(this._input)
				{
					this._input({ event, value });
				}
			};

			this.commit = ({ event, value }) =>
			{
				this.value = value;
				this.sync();

				if(this._change)
				{
					this._change({ event, value });
				}
			};

			this.input = ({ event, value }) =>
			{
				const hex = this.normalize(value);

				this.value = hex;
				this.sync();

				if(this._change)
				{
					this._change({ event, value: hex });
				}
			};

			this.open = ({ event }) =>
			{
				if(this.disabled)
				{
					return;
				}

				const native = event.target.closest('.holder').querySelector('.native');

				if(native)
				{
					native.click();
				}
			};

			this.clear = () =>
			{
				this.value = '';
				this.sync();

				if(this._change)
				{
					this._change({ event: null, value: '' });
				}
			};

			this.copy = () =>
			{
				if(!this.value || !navigator.clipboard)
				{
					return;
				}

				navigator.clipboard.writeText(this.value);
				this.copied = true;

				setTimeout(() =>
				{
					this.copied = false;
				}, 1500);
			};

			this.pickPreset = (event, hex) =>
			{
				if(this.disabled)
				{
					return;
				}

				this.value = hex;
				this.sync();

				if(this._change)
				{
					this._change({ event, value: hex });
				}
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
					<div class="field">
						<div class="swatch" :style="value ? 'background: ' + value : ''" ot-click="open">
							<input class="native" type="color" :value="value || '#000000'" ot-input="pick" ot-change="commit" tabindex="-1" :disabled="disabled" />
						</div>
						<input
							class="input"
							:name="name"
							type="text"
							:value="value"
							:placeholder="placeholder"
							:disabled="disabled"
							maxlength="7"
							autocomplete="off"
							spellcheck="false"
							ot-change="input"
						/>
						<button
							ot-if="value && !disabled"
							type="button"
							:class="'action' + (copied ? ' copied' : '')"
							ot-click.stop="copy"
							:ot-tooltip="{ text: copied ? 'Copied!' : 'Copy', position: { x: 'center', y: 'top' } }"
						>
							<i ot-if="!copied">content_copy</i>
							<i ot-if="copied">check</i>
						</button>
						<button
							ot-if="value && !disabled"
							type="button"
							class="action"
							ot-click.stop="clear"
							:ot-tooltip="{ text: 'Clear', position: { x: 'center', y: 'top' } }"
						>
							<i>close</i>
						</button>
					</div>
					<div ot-if="hasPresets" class="presets">
						<button
							ot-for="preset in presets"
							type="button"
							:class="'preset' + (value === preset ? ' active' : '')"
							:style="'background: ' + preset"
							:ot-tooltip="{ text: preset, position: { x: 'center', y: 'top' } }"
							ot-click="(event) => pickPreset(event, preset)"
						></button>
					</div>
				</div>
			`;
		}
	});
});
