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
			},
			variables:
			{
				type: 'object',
				value: {},
				description: 'Available variables to set the value via the variable builder modal.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.copied = false;

			this.Compute(() =>
			{
				this.hasPresets = this.presets && this.presets.length > 0;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.background, 'size-' + this.size];

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

			/* ===== VARIABLES ===== */

			this.hasVariables = () =>
			{
				return this.variables && typeof this.variables === 'object' && Object.keys(this.variables).length > 0;
			};

			this.isExpression = () =>
			{
				return /^\{\{\s*[\s\S]+\s*\}\}$/.test(String(this.value || '').trim());
			};

			this.openVariableBuilder = () =>
			{
				const modalId = 'modal-var-builder-' + Date.now();
				const currentValue = this.value || '';

				const initial = (() =>
				{
					const m = /^\{\{\s*([\s\S]*?)\s*\}\}$/.exec(String(currentValue).trim());
					return m ? m[1] : '';
				})();

				const onSave = ({ expression }) =>
				{
					const wrapped = '{{ ' + expression + ' }}';
					this.value = wrapped;

					if(this._change)
					{
						this._change({ event: null, value: wrapped });
					}

					$ot.float.close(modalId);
					this.Update();
				};

				const onCancel = () =>
				{
					$ot.float.close(modalId);
				};

				const variables = this.variables;

				$ot.float.modal(function()
				{
					this.variables = variables;
					this.initial = initial;
					this.onSave = onSave;
					this.onCancel = onCancel;

					return /* html */ `<e-variable-builder :variables="variables" :value="initial" :_save="onSave" :_cancel="onCancel"></e-variable-builder>`;
				}, { id: modalId });
			};

			this.clearExpression = () =>
			{
				this.value = '';

				if(this._change)
				{
					this._change({ event: null, value: '' });
				}

				this.Update();
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<e-variable-chip
						ot-if="isExpression()"
						:value="value"
						:size="size"
						:disabled="disabled"
						:_edit="openVariableBuilder"
						:_clear="clearExpression"
					></e-variable-chip>

					<div ot-if="!isExpression()" class="field">
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
							ot-if="hasVariables() && !disabled"
							type="button"
							class="action"
							ot-click.stop="openVariableBuilder"
							:ot-tooltip="{ text: 'Insert variable', position: { x: 'center', y: 'top' } }"
						>
							<i>data_object</i>
						</button>
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
					<div ot-if="!isExpression() && hasPresets" class="presets">
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
