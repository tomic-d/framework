const otboot =
{
	ready: () =>
	{
		window.onetype.Emit('@document.ready');
	},

	load: () =>
	{
		window.onetype.Emit('@document.load');
	},

	resize: () =>
	{
		window.onetype.Emit('@window.resize', {
			width: window.innerWidth,
			height: window.innerHeight
		});
	},

	scroll: () =>
	{
		window.onetype.Emit('@window.scroll', {
			x: window.scrollX,
			y: window.scrollY
		});
	},

	visibility: () =>
	{
		window.onetype.Emit('@document.visibility', {
			hidden: document.hidden,
			state: document.visibilityState
		});
	},

	beforeunload: () =>
	{
		window.onetype.Emit('@window.beforeunload');
	},

	focus: () =>
	{
		window.onetype.Emit('@window.focus');
	},

	blur: () =>
	{
		window.onetype.Emit('@window.blur');
	},

	orientation: () =>
	{
		window.onetype.Emit('@window.orientation', {
			angle: screen.orientation?.angle || window.orientation,
			type: screen.orientation?.type || 'unknown'
		});
	},

	online: () =>
	{
		window.onetype.Emit('@navigator.online');
	},

	offline: () =>
	{
		window.onetype.Emit('@navigator.offline');
	},

	popstate: (event) =>
	{
		window.onetype.Emit('@history.popstate', {
			state: event.state,
			pathname: window.location.pathname
		});
	}
};

document.addEventListener('visibilitychange', otboot.visibility);

window.addEventListener('resize', otboot.resize);
window.addEventListener('scroll', otboot.scroll);
window.addEventListener('beforeunload', otboot.beforeunload);
window.addEventListener('focus', otboot.focus);
window.addEventListener('blur', otboot.blur);
window.addEventListener('orientationchange', otboot.orientation);
window.addEventListener('online', otboot.online);
window.addEventListener('offline', otboot.offline);
window.addEventListener('popstate', otboot.popstate);

if(document.readyState === 'loading')
{
	document.addEventListener('DOMContentLoaded', otboot.ready);
	window.addEventListener('load', otboot.load);
}
else if(document.readyState === 'interactive')
{
	otboot.ready();
	window.addEventListener('load', otboot.load);
}
else
{
	otboot.ready();
	otboot.load();
}
