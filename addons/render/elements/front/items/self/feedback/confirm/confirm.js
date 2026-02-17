import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'confirm',
	icon: 'help',
	name: 'Confirm',
	description: 'Confirmation dialog with title, message, and action buttons.',
	category: 'Feedback',
	author: 'Divhunt',
	config: {
		title: {
			type: 'string',
			value: 'Confirm Action'
		},
		text: {
			type: 'string',
			value: 'Are you sure you want to proceed?'
		},
		confirm: {
			type: 'string',
			value: 'Confirm'
		},
		cancel: {
			type: 'string',
			value: 'Cancel'
		},
		variant: {
			type: 'array',
			value: ['bg-2', 'size-m', 'animate-bounce'],
			options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'animate-bounce', 'size-s', 'size-m', 'size-l']
		},
		visible: {
			type: 'boolean',
			value: true
		},
		onConfirm: {
			type: 'function'
		},
		onCancel: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleConfirm = () =>
		{
			this.visible = false;
			if (this.onConfirm)
			{
				this.onConfirm();
			}
		};

		this.handleCancel = () =>
		{
			this.visible = false;
			if (this.onCancel)
			{
				this.onCancel();
			}
		};

		return `
			<div dh-if="visible" class="holder" :variant="variant.join(' ')">
				<div dh-if="title" class="header">
					<div class="title">{{ title }}</div>
				</div>

				<div class="content">
					<div dh-if="text" class="text">{{ text }}</div>
					<slot></slot>
				</div>

				<div class="footer">
					<e-button dh-if="cancel" :variant="['ghost', 'size-m']" :text="cancel" :onClick="handleCancel"></e-button>
					<e-button dh-if="confirm" :variant="['brand', 'size-m']" :text="confirm" :onClick="handleConfirm"></e-button>
				</div>
			</div>
		`;
	}
});
