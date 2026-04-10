const popup = onetype.Addon('popup');

onetype.$ot.popup = function(target, render, options)
{
	return popup.Fn('popup', target, render, options);
};

onetype.$ot.popup.open = onetype.$ot.popup;
onetype.$ot.popup.close = (id) => popup.Fn('close', id);

onetype.$ot.modal = function(render, options)
{
	return popup.Fn('modal', render, options);
};

onetype.$ot.modal.open = onetype.$ot.modal;
onetype.$ot.modal.close = (id) => popup.Fn('close', id);

onetype.$ot.tooltip = function(target, text, options)
{
	return popup.Fn('tooltip', target, text, options);
};

onetype.$ot.tooltip.open = onetype.$ot.tooltip;
onetype.$ot.tooltip.close = (id) => popup.Fn('close', id);

onetype.$ot.toast = function(message, options)
{
	return popup.Fn('toast', message, options);
};

onetype.$ot.toast.open = onetype.$ot.toast;
onetype.$ot.toast.close = (id) => popup.Fn('close', id);

onetype.$ot.confirm = function(title, description, options)
{
	return popup.Fn('confirm', title, description, options);
};

