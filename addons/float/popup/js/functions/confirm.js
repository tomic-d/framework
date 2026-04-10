popup.Fn('confirm', function(title, description, options = {})
{
	if(typeof description === 'object')
	{
		options = description;
		description = '';
	}

	return new Promise((resolve) =>
	{
		const id = 'confirm-' + onetype.GenerateUID();
		let resolved = false;

		const close = (value) =>
		{
			if(resolved) return;
			resolved = true;
			overlay.Remove();
			resolve(value);
		};

		const overlay = overlays.Item({
			id: options.id || id,
			position: { x: 'center', y: 'center' },
			backdrop: options.backdrop ?? 0.4,
			closeable: true,
			escape: true,
			onOpen: (item) =>
			{
				const element = item.Get('element');

				if(element)
				{
					element.classList.add('ot-modal');
				}
			},
			onClose: () => close(options.input ? null : false),
			render: function()
			{
				this.value = options.value || '';
				this.hasInput = !!options.input;

				this.input = ({ value }) =>
				{
					this.value = value;
				};

				this.cancel = () =>
				{
					close(this.hasInput ? null : false);
				};

				this.submit = () =>
				{
					close(this.hasInput ? this.value : true);
				};

				this.keydown = ({ event }) =>
				{
					if(event.key === 'Enter' && this.hasInput && this.value)
					{
						event.preventDefault();
						this.submit();
					}
				};

				this.title = title || '';
				this.description = description || '';
				this.hasIcon = !!options.icon;
				this.icon = options.icon || '';
				this.type = options.type || 'default';
				this.confirmText = options.confirm || (this.hasInput ? 'Continue' : 'Confirm');
				this.cancelText = options.cancel || 'Cancel';
				this.confirmVariant = (this.type === 'danger') ? ['red', 'size-m'] : ['brand', 'size-m'];
				this.placeholder = options.placeholder || '';

				return /* html */ `
					<div class="ot-confirm">
						<div ot-if="hasIcon" :class="'icon ' + type"><i>{{ icon }}</i></div>
						<h3 class="title">{{ title }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>
						<div ot-if="hasInput" class="input">
							<e-form-input
								:value="value"
								:placeholder="placeholder"
								:_input="input"
								:variant="['bg-2', 'border', 'size-m']"
								ot-keydown="keydown"
							></e-form-input>
						</div>
						<div class="actions">
							<e-form-button :text="cancelText" :variant="['bg-2', 'border', 'size-m']" :_click="cancel"></e-form-button>
							<e-form-button :text="confirmText" :variant="confirmVariant" :_click="submit"></e-form-button>
						</div>
					</div>
				`;
			}
		});
	});
});
