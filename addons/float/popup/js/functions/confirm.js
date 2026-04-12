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
		let overlay = null;

		const finish = (value) =>
		{
			if(resolved)
			{
				return;
			}

			resolved = true;
			resolve(value);

			if(overlay && overlays.ItemGet(overlay.Get('id')))
			{
				overlay.Remove();
			}
		};

		overlay = overlays.Item({
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
			onClose: () => finish(options.input ? null : false),
			render: function()
			{
				const initialValue = options.value || '';
				const hasInput = !!options.input;

				/* Internal value holder - NOT bound to render data,
				   so input doesn't re-render and lose focus on every keystroke */
				let currentValue = initialValue;

				this.title = title || '';
				this.description = description || '';
				this.hasInput = hasInput;
				this.hasIcon = !!options.icon;
				this.icon = options.icon || '';
				this.type = options.type || 'default';
				this.confirmText = options.confirm || (hasInput ? 'Continue' : 'Confirm');
				this.cancelText = options.cancel || 'Cancel';
				this.confirmColor = (this.type === 'danger') ? 'red' : 'brand';
				this.placeholder = options.placeholder || '';
				this.initialValue = initialValue;

				this.input = ({ value }) =>
				{
					currentValue = value;
				};

				this.cancel = () =>
				{
					finish(hasInput ? null : false);
				};

				this.submit = () =>
				{
					finish(hasInput ? currentValue : true);
				};

				this.keydown = ({ event }) =>
				{
					if(event.key === 'Enter' && hasInput && currentValue)
					{
						event.preventDefault();
						this.submit();
					}
				};

				return /* html */ `
					<div class="ot-confirm">
						<div ot-if="hasIcon" :class="'icon ' + type"><i>{{ icon }}</i></div>
						<h3 class="title">{{ title }}</h3>
						<p ot-if="description" class="description">{{ description }}</p>
						<div ot-if="hasInput" class="input">
							<e-form-input
								:value="initialValue"
								:placeholder="placeholder"
								:_input="input"
								background="bg-2"
								:border="true"
								ot-keydown="keydown"
							></e-form-input>
						</div>
						<div class="actions">
							<e-form-button :text="cancelText" background="bg-2" :_click="cancel"></e-form-button>
							<e-form-button :text="confirmText" :color="confirmColor" :_click="submit"></e-form-button>
						</div>
					</div>
				`;
			}
		});
	});
});
