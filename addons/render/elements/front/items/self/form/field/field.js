onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'form-field',
		icon: 'space_dashboard',
		name: 'Form Field',
		description: 'Form field row with label, description, hint, required and error states.',
		category: 'Form',
		author: 'OneType',
		config: {
			label: {
				type: 'string'
			},
			description: {
				type: 'string'
			},
			hint: {
				type: 'string'
			},
			error: {
				type: 'string'
			},
			required: {
				type: 'boolean'
			},
			orientation: {
				type: 'string',
				value: 'horizontal',
				options: ['horizontal', 'vertical']
			},
			variant: {
				type: 'array',
				value: ['size-m'],
				options: ['border-bottom', 'clean', 'size-s', 'size-m', 'size-l']
			}
		},
		render: function()
		{
			this.hasInfo = !!this.label || !!this.description;
			this.hasError = !!this.error;

			return /* html */ `
				<div :class="'holder ' + orientation + ' ' + variant.join(' ') + (hasError ? ' error' : '')">
					<div ot-if="hasInfo" class="info">
						<label ot-if="label" class="label">
							<span>{{ label }}</span>
							<span ot-if="required" class="required">*</span>
							<i ot-if="hint" class="hint" :ot-tooltip="{ text: hint, position: { x: 'center', y: 'top' } }">info</i>
						</label>
						<p ot-if="description" class="description">{{ description }}</p>
					</div>
					<div class="control">
						<div class="input">
							<slot name="input"></slot>
						</div>
						<div ot-if="hasError" class="error-message">
							<i>error</i>
							<span>{{ error }}</span>
						</div>
					</div>
				</div>
			`;
		}
	});
});
