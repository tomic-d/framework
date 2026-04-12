onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'status-error',
		icon: 'error',
		name: 'Error',
		description: 'Error state with icon, message and retry action.',
		category: 'Status',
		config:
		{
			icon:
			{
				type: 'string',
				value: 'error',
				description: 'Center icon name.'
			},
			title:
			{
				type: 'string',
				value: 'Something went wrong',
				description: 'Error heading.'
			},
			description:
			{
				type: 'string',
				value: 'An unexpected error occurred. Please try again.',
				description: 'Error detail text.'
			},
			action:
			{
				type: 'string',
				value: 'Try Again',
				description: 'Retry button label. Empty hides button.'
			},
			color:
			{
				type: 'string',
				value: 'red',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Icon circle accent color.'
			},
			size:
			{
				type: 'string',
				value: 'm',
				options: ['s', 'm', 'l'],
				description: 'Component size.'
			},
			_click:
			{
				type: 'function',
				description: 'Retry handler. Receives { event }. Reloads page if not set.'
			}
		},
		render: function()
		{
			/* ===== CLASSES ===== */

			this.classes = () =>
			{
				return 'box ' + this.color + ' size-' + this.size;
			};

			/* ===== HANDLERS ===== */

			this.retry = ({ event }) =>
			{
				if(this._click)
				{
					this._click({ event });
					return;
				}

				window.location.reload();
			};

			/* ===== RENDER ===== */

			return /* html */ `
				<div :class="classes()">
					<div class="inner">
						<div class="circle"><i>{{ icon }}</i></div>
						<h2 ot-if="title" class="title">{{ title }}</h2>
						<p ot-if="description" class="description">{{ description }}</p>
						<e-form-button
							ot-if="action"
							:text="action"
							icon="refresh"
							color="brand"
							size="m"
							:_click="retry"
						></e-form-button>
					</div>
				</div>
			`;
		}
	});
});
