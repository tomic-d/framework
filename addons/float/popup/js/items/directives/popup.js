onetype.AddonReady('directives', function(directives)
{
	document.addEventListener('click', function(event)
	{
		let node = event.target;

		while (node && node !== document)
		{
			if ('otPopupConfig' in node)
			{
				if (node.otPopupOverlay)
				{
					node.otPopupOverlay.Remove();
					node.otPopupOverlay = null;
				}
				else
				{
					const config = Object.assign({}, node.otPopupConfig);
					const userOnClose = config.onClose;

					config.onClose = (item) =>
					{
						node.otPopupOverlay = null;

						if (typeof userOnClose === 'function')
						{
							userOnClose(item);
						}
					};

					node.otPopupOverlay = popup.Fn('popup', node, config.render, config);
				}

				break;
			}

			node = node.parentNode;
		}
	});

	directives.ItemAdd({
		id: 'ot-popup',
		icon: 'smart_popup',
		name: 'Popup',
		description: 'Shows popup on click.',
		trigger: 'node',
		order: 600,
		attributes: {
			'ot-popup': ['string|object|function']
		},
		code: function(data, item, compile, node)
		{
			const value = data['ot-popup'].value;

			if (typeof value === 'string')
			{
				node.otPopupConfig = {render: value};
			}
			else if (typeof value === 'function')
			{
				node.otPopupConfig = {render: value};
			}
			else if (typeof value === 'object')
			{
				node.otPopupConfig = value;
			}

			node.otPopupOverlay = null;
		}
	});
});
