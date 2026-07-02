popup.Fn('template.confirm', function(title, description, options = {})
{
	if(typeof description === 'object')
	{
		options = description;
		description = '';
	}

	options = onetype.DataDefine({ ...options }, {
		id: { type: 'string' },
		type: { type: 'string', value: 'default', options: ['default', 'danger', 'warning', 'info', 'success'] },
		icon: { type: 'string' },
		input: { type: 'boolean', value: false },
		value: { type: 'string' },
		placeholder: { type: 'string' },
		confirm: { type: 'string' },
		cancel: { type: 'string' },
		backdrop: { type: 'number', value: 0.4 }
	});

	return new Promise((resolve) =>
	{
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
			id: options.id || 'confirm-' + onetype.GenerateUID(),
			position: { x: 'center', y: 'center' },
			backdrop: options.backdrop,
			closeable: true,
			escape: true,
			onOpen: (item) =>
			{
				item.Get('element')?.classList.add('ot-modal');
			},
			onClose: () => finish(options.input ? null : false),
			render: function()
			{
				this.config = { title, description, ...options };

				this.confirm = (value) => finish(options.input ? value : true);
				this.cancel = () => finish(options.input ? null : false);

				return '<e-popup-confirm :config="config" :_confirm="confirm" :_cancel="cancel"></e-popup-confirm>';
			}
		});

		setTimeout(() =>
		{
			const input = overlay.Get('element')?.querySelector('input');

			if(input)
			{
				input.focus();
				input.setSelectionRange(input.value.length, input.value.length);
			}
		}, 0);
	});
});
