onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-color',
		icon: 'palette',
		name: 'Color',
		description: 'Color picker with native input, hex validation, presets and copy action.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'Hex color value.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Input name attribute.'
			},
			placeholder:
			{
				type: 'string',
				value: '#000000',
				description: 'Placeholder text.'
			},
			presets:
			{
				type: 'array',
				value: [],
				each: { type: 'string' },
				description: 'Preset color swatches.'
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
				description: 'Picker size.'
			},
			disabled:
			{
				type: 'boolean',
				value: false,
				description: 'Disabled state.'
			},
			_input:
			{
				type: 'function',
				description: 'Live input handler. Receives { event, value }.'
			},
			_change:
			{
				type: 'function',
				description: 'Commit handler. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.copied = false;
			this.hasPresets = this.presets && this.presets.length > 0;

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

			/* ===== HANDLERS ===== */

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

				const native = event.target.closest('.box')?.querySelector('.native');

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

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
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
