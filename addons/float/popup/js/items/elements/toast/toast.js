onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'popup-toast',
		icon: 'notifications',
		name: 'Toast',
		description: 'Floating notification card with type accent, icon, text, close and auto dismiss progress.',
		category: 'Float',
		author: 'OneType',
		config: {
			config: {
				type: 'object',
				value: {},
				config: {
					type: {
						type: 'string',
						value: 'info',
						options: ['info', 'success', 'warning', 'error'],
						description: 'Tone of the toast, drives the accent color.'
					},
					title: {
						type: 'string',
						description: 'Bold first line.'
					},
					message: {
						type: 'string',
						description: 'Text below the title.'
					},
					icon: {
						type: 'string',
						description: 'Material icon name.'
					},
					closeable: {
						type: 'boolean',
						value: true,
						description: 'Shows the close button.'
					},
					duration: {
						type: 'number',
						value: 5000,
						description: 'Auto dismiss time in milliseconds, drives the progress line. Zero keeps the toast until closed.'
					}
				},
				description: 'Toast content and behavior.'
			},
			_close: {
				type: 'function',
				description: 'Called when the close button is clicked.'
			}
		},
		render: function()
		{
			const icons = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };

			this.Compute(() =>
			{
				this.type = this.config.type || 'info';
				this.title = this.config.title || '';
				this.message = this.config.message || '';
				this.icon = this.config.icon || icons[this.type] || 'info';
				this.closeable = this.config.closeable !== false;
				this.duration = this.config.duration || 0;
			});

			this.dismiss = () =>
			{
				this._close && this._close();
			};

			return `
				<div :class="'box ' + type">
					<i class="icon">{{ icon }}</i>
					<div class="content">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="message" class="message">{{ message }}</div>
					</div>
					<button ot-if="closeable" class="close" ot-click="dismiss"><i>close</i></button>
					<span ot-if="duration" class="progress" :style="'animation-duration: ' + duration + 'ms'"></span>
				</div>
			`;
		}
	});
});
