const popup = onetype.Addon('popup');

onetype.$ot.float = {
	popup: (target, render, options) => popup.Fn('popup', target, render, options),
	modal: (render, options) => popup.Fn('modal', render, options),
	drawer: (options) => popup.Fn('template.drawer', options),
	tooltip: (target, text, options) => popup.Fn('template.tooltip', target, text, options),
	toast: (message, options) => popup.Fn('template.toast', message, options),
	confirm: (title, description, options) => popup.Fn('template.confirm', title, description, options),
	close: (id) => popup.Fn('close', id)
};
