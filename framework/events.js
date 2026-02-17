// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const handleReady = () =>
{
    window.divhunt.Emit('document.ready');
};

const handleLoad = () =>
{
    window.divhunt.Emit('document.load');
};

const handleResize = () =>
{
    window.divhunt.Emit('window.resize',
    {
        width: window.innerWidth,
        height: window.innerHeight
    });
};

const handleScroll = () =>
{
    window.divhunt.Emit('window.scroll',
    {
        x: window.scrollX,
        y: window.scrollY
    });
};

const handleVisibility = () =>
{
    window.divhunt.Emit('document.visibility',
    {
        hidden: document.hidden,
        state: document.visibilityState
    });
};

const handleBeforeUnload = () =>
{
    window.divhunt.Emit('window.beforeunload');
};

const handleFocus = () =>
{
    window.divhunt.Emit('window.focus');
};

const handleBlur = () =>
{
    window.divhunt.Emit('window.blur');
};

const handleOrientation = () =>
{
    window.divhunt.Emit('window.orientation',
    {
        angle: screen.orientation?.angle || window.orientation,
        type: screen.orientation?.type || 'unknown'
    });
};

const handleOnline = () =>
{
    window.divhunt.Emit('navigator.online');
};

const handleOffline = () =>
{
    window.divhunt.Emit('navigator.offline');
};

const handlePopstate = (event) =>
{
    window.divhunt.Emit('history.popstate',
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