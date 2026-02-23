const handleReady = () =>
{
    window.onetype.Emit('document.ready');
};

const handleLoad = () =>
{
    window.onetype.Emit('document.load');
};

const handleResize = () =>
{
    window.onetype.Emit('window.resize',
    {
        width: window.innerWidth,
        height: window.innerHeight
    });
};

const handleScroll = () =>
{
    window.onetype.Emit('window.scroll',
    {
        x: window.scrollX,
        y: window.scrollY
    });
};

const handleVisibility = () =>
{
    window.onetype.Emit('document.visibility',
    {
        hidden: document.hidden,
        state: document.visibilityState
    });
};

const handleBeforeUnload = () =>
{
    window.onetype.Emit('window.beforeunload');
};

const handleFocus = () =>
{
    window.onetype.Emit('window.focus');
};

const handleBlur = () =>
{
    window.onetype.Emit('window.blur');
};

const handleOrientation = () =>
{
    window.onetype.Emit('window.orientation',
    {
        angle: screen.orientation?.angle || window.orientation,
        type: screen.orientation?.type || 'unknown'
    });
};

const handleOnline = () =>
{
    window.onetype.Emit('navigator.online');
};

const handleOffline = () =>
{
    window.onetype.Emit('navigator.offline');
};

const handlePopstate = (event) =>
{
    window.onetype.Emit('history.popstate',
    {
        state: event.state,
        pathname: window.location.pathname
    });
};

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', handleReady);
    window.addEventListener('load', handleLoad);
}
else if (document.readyState === 'interactive')
{
    handleReady();
    window.addEventListener('load', handleLoad);
}
else
{
    handleReady();
    handleLoad();
}

window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
document.addEventListener('visibilitychange', handleVisibility);
window.addEventListener('beforeunload', handleBeforeUnload);
window.addEventListener('focus', handleFocus);
window.addEventListener('blur', handleBlur);
window.addEventListener('orientationchange', handleOrientation);
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
window.addEventListener('popstate', handlePopstate);