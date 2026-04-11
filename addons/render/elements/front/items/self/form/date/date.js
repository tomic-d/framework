onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-date',
		icon: 'calendar_today',
		name: 'Date',
		description: 'Premium date picker with native input, min/max range, presets and clear action.',
		category: 'Form',
		author: 'OneType',
		config: {
			value: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			min: {
				type: 'string'
			},
			max: {
				type: 'string'
			},
			placeholder: {
				type: 'string'
			},
			presets: {
				type: 'array',
				value: [],
				each: {
					type: 'object',
					config: {
						label: { type: 'string' },
						value: { type: 'string' }
					}
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
			_change: {
				type: 'function'
			}
		},
		render: function()
		{
			const today = new Date();
			const todayIso = today.toISOString().slice(0, 10);

			this.todayIso = todayIso;
			this.hasPresets = this.presets && this.presets.length > 0;

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

			this.isToday = this.value === todayIso;

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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '') + (isToday ? ' today' : '')">
					<div class="field">
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
