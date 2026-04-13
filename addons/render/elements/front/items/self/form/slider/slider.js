onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-slider',
		icon: 'linear_scale',
		name: 'Slider',
		description: 'Range slider with label, value display, marks and color variants.',
		category: 'Form',
		config:
		{
			label:
			{
				type: 'string',
				value: '',
				description: 'Label above the track.'
			},
			description:
			{
				type: 'string',
				value: '',
				description: 'Description below the label.'
			},
			name:
			{
				type: 'string',
				value: '',
				description: 'Form field name.'
			},
			value:
			{
				type: 'number',
				value: 0,
				description: 'Current value.'
			},
			min:
			{
				type: 'number',
				value: 0,
				description: 'Minimum value.'
			},
			max:
			{
				type: 'number',
				value: 100,
				description: 'Maximum value.'
			},
			step:
			{
				type: 'number',
				value: 1,
				description: 'Step increment.'
			},
			showValue:
			{
				type: 'boolean',
				value: false,
				description: 'Show current value badge in header.'
			},
			showRange:
			{
				type: 'boolean',
				value: false,
				description: 'Show min/max labels below track.'
			},
			marks:
			{
				type: 'boolean',
				value: false,
				description: 'Show tick marks at each step.'
			},
			prefix:
			{
				type: 'string',
				value: '',
				description: 'Text before value display.'
			},
			suffix:
			{
				type: 'string',
				value: '',
				description: 'Text after value display.'
			},
			color:
			{
				type: 'string',
				value: 'brand',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Fill color.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Track and thumb size.'
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
				description: 'Fires on drag. Receives { event, value }.'
			},
			_change:
			{
				type: 'function',
				description: 'Fires on release. Receives { event, value }.'
			}
		},
		render: function()
		{
			/* ===== STATE ===== */

			this.Compute(() =>
			{
				this.hasInfo = !!this.label || !!this.description;
				this.hasMeta = this.showValue || this.showRange;
			});

			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				const list = ['box', this.color, 'size-' + this.size];

				if(this.disabled)
				{
					list.push('disabled');
				}

				return list.join(' ');
			};

			/* ===== HELPERS ===== */

			this.format = (value) =>
			{
				return (this.prefix || '') + value + (this.suffix || '');
			};

			this.percentage = () =>
			{
				if(this.max === this.min)
				{
					return 0;
				}

				return ((this.value - this.min) / (this.max - this.min)) * 100;
			};

			this.computeMarks = () =>
			{
				if(!this.marks || !this.step || this.step <= 0)
				{
					return [];
				}

				const range = this.max - this.min;
				const count = Math.floor(range / this.step);

				if(count > 20)
				{
					return [];
				}

				const result = [];

				for(let i = 0; i <= count; i++)
				{
					const value = this.min + i * this.step;
					const percent = (i / count) * 100;

					result.push({ value, percent });
				}

				return result;
			};

			this.marksList = this.computeMarks();
			this.hasMarks = this.marksList.length > 0;

			/* ===== HANDLERS ===== */

			this.OnReady(() =>
			{
				const input = this.Element?.querySelector('input[type="range"]');

				if(input)
				{
					input.value = this.value;
				}
			});

			this.handle = ({ event }) =>
			{
				this.value = parseFloat(event.target.value);

				if(this._input)
				{
					this._input({ event, value: this.value });
				}
			};

			this.commit = ({ event }) =>
			{
				this.value = parseFloat(event.target.value);

				if(this._change)
				{
					this._change({ event, value: this.value });
				}
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div ot-if="hasInfo || showValue" class="head">
						<div ot-if="hasInfo" class="info">
							<span ot-if="label" class="label">{{ label }}</span>
							<span ot-if="description" class="description">{{ description }}</span>
						</div>
						<span ot-if="showValue" class="value">{{ format(value) }}</span>
					</div>
					<div class="control">
						<div class="track">
							<div class="fill" :style="'width: ' + percentage() + '%'"></div>
							<div ot-if="hasMarks" class="marks">
								<span
									ot-for="mark in marksList"
									:class="'mark' + (mark.value <= value ? ' active' : '')"
									:style="'left: ' + mark.percent + '%'"
								></span>
							</div>
						</div>
						<input
							type="range"
							:value="value"
							:name="name"
							:min="min"
							:max="max"
							:step="step"
							:disabled="disabled"
							ot-input="handle"
							ot-change="commit"
						/>
					</div>
					<div ot-if="showRange" class="range">
						<span class="min">{{ format(min) }}</span>
						<span class="max">{{ format(max) }}</span>
					</div>
				</div>
			`;
		}
	});
});
