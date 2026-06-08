const popup = onetype.Addon('popup');

onetype.$ot.float = {};

onetype.$ot.float.popup = function(target, render, options)
{
	return popup.Fn('popup', target, render, options);
};

onetype.$ot.float.popup.open = onetype.$ot.float.popup;
onetype.$ot.float.popup.close = (id) => popup.Fn('close', id);

onetype.$ot.float.modal = function(render, options)
{
	return popup.Fn('modal', render, options);
};

onetype.$ot.float.modal.open = onetype.$ot.float.modal;
onetype.$ot.float.modal.close = (id) => popup.Fn('close', id);

onetype.$ot.float.panel = function(options)
{
	return popup.Fn('panel', options);
};

onetype.$ot.float.panel.close = (id) => popup.Fn('close', id);

onetype.$ot.float.tooltip = function(target, text, options)
{
	return popup.Fn('tooltip', target, text, options);
};

onetype.$ot.float.tooltip.open = onetype.$ot.float.tooltip;
onetype.$ot.float.tooltip.close = (id) => popup.Fn('close', id);

onetype.$ot.float.toast = function(message, options)
{
	return popup.Fn('toast', message, options);
};

onetype.$ot.float.toast.open = onetype.$ot.float.toast;
onetype.$ot.float.toast.close = (id) => popup.Fn('close', id);

onetype.$ot.float.confirm = function(title, description, options)
{
	return popup.Fn('confirm', title, description, options);
};

/* Aliases — keep the flat API working for existing callers. */

onetype.$ot.popup = onetype.$ot.float.popup;
onetype.$ot.modal = onetype.$ot.float.modal;
onetype.$ot.tooltip = onetype.$ot.float.tooltip;
onetype.$ot.toast = onetype.$ot.float.toast;
onetype.$ot.confirm = onetype.$ot.float.confirm;
