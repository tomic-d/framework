onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-slider',
		icon: 'linear_scale',
		name: 'Slider',
		description: 'Premium range slider with label, value display, marks, tooltip and color variants.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			value: {
				type: 'number',
				value: 0
			},
			min: {
				type: 'number',
				value: 0
			},
			max: {
				type: 'number',
				value: 100
			},
			step: {
				type: 'number',
				value: 1
			},
			showValue: {
				type: 'boolean'
			},
			showRange: {
				type: 'boolean'
			},
			marks: {
				type: 'boolean'
			},
			prefix: {
				type: 'string'
			},
			suffix: {
				type: 'string'
			},
			disabled: {
				type: 'boolean'
			},
			variant: {
				type: 'array',
				value: ['brand', 'size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'size-s', 'size-m', 'size-l']
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
			this.hasInfo = !!this.label || !!this.description;
			this.hasMeta = this.showValue || this.showRange;

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

			return /* html */ `
				<div :class="'holder ' + variant.join(' ') + (disabled ? ' disabled' : '')">
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
						<span class="range-min">{{ format(min) }}</span>
						<span class="range-max">{{ format(max) }}</span>
					</div>
				</div>
			`;
		}
	});
});
