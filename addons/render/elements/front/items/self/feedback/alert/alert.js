import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'alert',
	icon: 'info',
	name: 'Alert',
	description: 'Notification box with variants (info, success, warning, error), optional close button, and customizable content.',
	category: 'Feedback',
	author: 'Divhunt',
	config: {
		title: {
			type: 'string',
			value: 'Alert Title'
		},
		text: {
			type: 'string',
			value: 'This is an alert message.'
		},
		variant: {
			type: 'array',
			value: ['orange', 'size-m', 'animate-bounce'],
			options: ['brand', 'blue', 'red', 'orange', 'green', 'border', 'animate-bounce', 'size-s', 'size-m', 'size-l']
		},
		icon: {
			type: 'string',
			value: 'info'
		},
		close: {
			type: 'boolean',
			value: true
		},
		visible: {
			type: 'boolean',
			value: true
		},
		onClose: {
			type: 'function'
		}
	},
	render: function()
	{
		this.handleClose = () =>
		{
			this.visible = false;
			if (this.onClose)
			{
				this.onClose();
			}
		};

		return `
			<div dh-if="visible" class="holder" :variant="variant.join(' ')">
				<i dh-if="icon" class="icon">{{ icon }}</i>

				<div class="content">
					<div dh-if="title" class="title">{{ title }}</div>
					<div dh-if="text" class="text">{{ text }}</div>
					<slot></slot>
				</div>

				<button dh-if="close" class="close" dh-click="handleClose">
					<i class="icon">close</i>
				</button>
			</div>
		`;
	}
});
