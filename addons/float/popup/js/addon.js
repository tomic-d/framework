const popup = onetype.Addon('popup');

const close = (id) => popup.Fn('close', id);

onetype.$ot.popup = function(target, render, options)
{
	return popup.Fn('popup', target, render, options);
};

onetype.$ot.popup.open = onetype.$ot.popup;
onetype.$ot.popup.close = close;

onetype.$ot.modal = function(render, options)
{
	return popup.Fn('modal', render, options);
};

onetype.$ot.modal.open = onetype.$ot.modal;
onetype.$ot.modal.close = close;

onetype.$ot.tooltip = function(target, text, options)
{
	return popup.Fn('tooltip', target, text, options);
};

onetype.$ot.tooltip.open = onetype.$ot.tooltip;
onetype.$ot.tooltip.close = close;

onetype.$ot.toast = function(message, options)
{
	return popup.Fn('toast', message, options);
};

onetype.$ot.toast.open = onetype.$ot.toast;
onetype.$ot.toast.close = close;

onetype.$ot.close = close;
