onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-date',
		icon: 'calendar_today',
		name: 'Date',
		description: 'Date picker with native input, min/max range, presets and clear action.',
		category: 'Form',
		config:
		{
			value:
			{
				type: 'string',
				value: '',
				description: 'Selected date in ISO format (YYYY-MM-DD).'
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
				value: '',
				description: 'Placeholder text.'
			},
			min:
			{
				type: 'string',
				value: '',
				description: 'Minimum selectable date (YYYY-MM-DD).'
			},
			max:
			{
				type: 'string',
				value: '',
				description: 'Maximum selectable date (YYYY-MM-DD).'
			},
			presets:
			{
				type: 'array',
				value: [],
				each:
				{
					type: 'object',
					config:
					{
						label: { type: 'string' },
						value: { type: 'string' }
					}
				},
				description: 'Quick-pick preset buttons.'
			},
			background:
			{
				type: 'string',
				value: 'bg-2',
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'transparent'],
				description: 'Background depth.'
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
				description: 'Change handler. Receives { event, value }.'
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

			const today = new Date().toISOString().slice(0, 10);

			this.todayIso = today;
			this.isToday = this.value === today;

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

				if(this.isToday)
				{
					list.push('today');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.inRange = (iso) =>
			{
				if(this.min && iso < this.min)
				{
					return false;
				}

				if(this.max && iso > this.max)
				{
					return false;
				}

				return true;
			};

			/* ===== HANDLERS ===== */

			this.handle = ({ event, value }) =>
			{
				this.value = value;
				this.isToday = value === this.todayIso;

				if(this._change)
				{
					this._change({ event, value });
				}
			};

			this.clear = () =>
			{
				this.value = '';
				this.isToday = false;

				if(this._change)
				{
					this._change({ event: null, value: '' });
				}
			};

			this.pickPreset = (event, iso) =>
			{
				if(this.disabled || !this.inRange(iso))
				{
					return;
				}

				this.value = iso;
				this.isToday = iso === this.todayIso;

				if(this._change)
				{
					this._change({ event, value: iso });
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

					$ot.modal.close(modalId);
					this.Update();
				};

				const onCancel = () =>
				{
					$ot.modal.close(modalId);
				};

				const variables = this.variables;

				$ot.modal(function()
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
						<i class="icon">calendar_today</i>
						<input
							class="input"
							type="date"
							:value="value"
							:name="name"
							:min="min"
							:max="max"
							:placeholder="placeholder"
							:disabled="disabled"
							ot-change="handle"
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
							:class="'preset' + (value === preset.value ? ' active' : '') + (!inRange(preset.value) ? ' disabled' : '')"
							:disabled="!inRange(preset.value) || disabled"
							ot-click="(event) => pickPreset(event, preset.value)"
						>
							{{ preset.label }}
						</button>
					</div>
				</div>
			`;
		}
	});
});
