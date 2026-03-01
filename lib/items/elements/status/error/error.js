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
			_click: {
				type: 'function'
			}
		},
		render: function()
		{
			this.retry = () =>
			{
				if (this._click)
				{
					this._click();
				}
				else
				{
					window.location.reload();
				}
			};

			return `
				<div class="holder">
					<div class="circle"><i>{{ icon }}</i></div>
					<h2 class="title">{{ title }}</h2>
					<p ot-if="description" class="description">{{ description }}</p>
					<e-form-button ot-if="action" :text="action" icon="refresh" :variant="['brand', 'size-m']" :_click="retry"></e-form-button>
				</div>
			`;
		}
	});
});
