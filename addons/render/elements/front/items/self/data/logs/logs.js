import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'logs',
	icon: 'terminal',
	name: 'Logs',
	description: 'Console-style log viewer with syntax highlighting and filtering.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		logs: {
			type: 'array',
			value: [
				{
					type: 'info',
					timestamp: '10:23:45',
					message: 'Server started on port 3000'
				},
				{
					type: 'success',
					timestamp: '10:23:46',
					message: 'Database connection established'
				},
				{
					type: 'warning',
					timestamp: '10:24:12',
					message: 'API rate limit approaching threshold'
				},
				{
					type: 'error',
					timestamp: '10:25:33',
					message: 'Failed to connect to external service'
				}
			]
		},
		variant: {
			type: 'array',
			value: ['light', 'border'],
			options: ['dark', 'light', 'compact', 'border']
		}
	},
	render: function()
	{
		this.getIcon = (type) =>
		{
			const icons = {
				info: 'info',
				success: 'check_circle',
				warning: 'warning',
				error: 'error'
			};
			return icons[type] || 'circle';
		};

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="log in logs" class="log-entry" :type="log.type">
					<span class="timestamp">{{ log.timestamp }}</span>
					<i class="icon">{{ getIcon(log.type) }}</i>
					<span class="message">{{ log.message }}</span>
				</div>
			</div>
		`;
	}
});
