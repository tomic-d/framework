onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-error',
		icon: 'error',
		name: 'Error',
		description: 'Full-page error state with icon, message, and retry action.',
		category: 'Status',
		author: 'OneType',
		config: {
			icon: {
				type: 'string',
				value: 'error'
			},
			title: {
				type: 'string',
				value: 'Something went wrong'
			},
			description: {
				type: 'string',
				value: 'An unexpected error occurred. Please try again.'
			},
			action: {
				type: 'string',
				value: 'Try Again'
			},
			variant: {
				type: 'array',
				value: ['red', 'size-m'],
				options: ['brand', 'blue', 'red', 'orange', 'green', 'bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'size-s', 'size-m', 'size-l']
			},
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.retry = (event) =>
			{
				if(this._click)
				{
					this._click({ event });
					return;
				}

				window.location.reload();
			};

			return /* html */ `
				<div :class="'holder ' + variant.join(' ')">
					<div class="circle"><i>{{ icon }}</i></div>
					<h2 ot-if="title" class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button
						ot-if="action"
						:text="action"
						icon="refresh"
						:variant="['brand', 'size-m']"
						:_click="retry"
					></e-form-button>
				</div>
			`;
		}
	});
});
