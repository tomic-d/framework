popup.Fn('tooltip', function(target, text, options = {})
{
	const config = typeof text === 'object' ? text : {text};
	const id = 'tooltip-' + onetype.GenerateUID();

	return overlays.Item({
		id: options.id || id,
		target,
		position: options.position || {x: 'center', y: 'top'},
		offset: options.offset || {x: 0, y: -4},
		flip: true,
		track: true,
		escape: true,
		onClose: options.onClose,
		onOpen: options.onOpen,
		render: function()
		{
			this.icon = config.icon || null;
			this.title = config.title || null;
			this.text = config.text || '';
			this.variant = config.variant || 'default';

			return `
				<div :class="'ot-tooltip ' + variant">
					<i ot-if="icon" class="icon">{{ icon }}</i>
					<div class="content">
						<div ot-if="title" class="title">{{ title }}</div>
						<div ot-if="text" class="text">{{ text }}</div>
					</div>
				</div>
			`;
		}
	});
});
