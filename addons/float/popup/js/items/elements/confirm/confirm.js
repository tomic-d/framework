onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'popup-confirm',
		icon: 'check_circle',
		name: 'Confirm',
		description: 'Confirmation dialog with icon, title, description, optional input and actions.',
		category: 'Float',
		author: 'OneType',
		config: {
			config: {
				type: 'object',
				value: {},
				config: {
					title: {
						type: 'string',
						description: 'Dialog heading.'
					},
					description: {
						type: 'string',
						description: 'Text below the heading.'
					},
					type: {
						type: 'string',
						value: 'default',
						options: ['default', 'danger', 'warning', 'info', 'success'],
						description: 'Tone of the dialog, colors the icon and the confirm action.'
					},
					icon: {
						type: 'string',
						description: 'Material icon name shown in the chip above the title.'
					},
					input: {
						type: 'boolean',
						value: false,
						description: 'Shows a text input, the confirm action resolves with its value.'
					},
					value: {
						type: 'string',
						description: 'Initial input value.'
					},
					placeholder: {
						type: 'string',
						description: 'Input placeholder.'
					},
					confirm: {
						type: 'string',
						description: 'Confirm button text.'
					},
					cancel: {
						type: 'string',
						description: 'Cancel button text.'
					}
				},
				description: 'Dialog content and behavior.'
			},
			_confirm: {
				type: 'function',
				description: 'Called with the input value on confirm.'
			},
			_cancel: {
				type: 'function',
				description: 'Called on cancel.'
			}
		},
		render: function()
		{
			let value = '';

			this.Compute(() =>
			{
				this.title = this.config.title || '';
				this.description = this.config.description || '';
				this.type = this.config.type || 'default';
				this.icon = this.config.icon || '';
				this.hasInput = this.config.input === true;
				this.initial = this.config.value || '';
				this.placeholder = this.config.placeholder || '';
				this.confirmText = this.config.confirm || (this.hasInput ? 'Continue' : 'Confirm');
				this.cancelText = this.config.cancel || 'Cancel';

				value = this.initial;
			});

			this.input = ({ event }) =>
			{
				value = event.target.value;
			};

			this.cancel = () =>
			{
				this._cancel && this._cancel();
			};

			this.submit = () =>
			{
				this._confirm && this._confirm(value);
			};

			this.keydown = ({ event }) =>
			{
				if(event.key === 'Enter' && value)
				{
					event.preventDefault();
					this.submit();
				}
			};

			return `
				<div :class="'box ' + type">
					<div ot-if="icon" class="icon"><i>{{ icon }}</i></div>
					<h3 class="title">{{ title }}</h3>
					<p ot-if="description" class="description">{{ description }}</p>
					<input ot-if="hasInput" class="input" type="text" :value="initial" :placeholder="placeholder" ot-input="input" ot-keydown="keydown" />
					<div class="actions">
						<button class="cancel" ot-click="cancel">{{ cancelText }}</button>
						<button class="confirm" ot-click="submit">{{ confirmText }}</button>
					</div>
				</div>
			`;
		}
	});
});
