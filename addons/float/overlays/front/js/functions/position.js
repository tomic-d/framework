overlays.Fn('position', function(target, overlay, position, offset, padding)
{
    const isBody = !target || target === document.body;
    const rect = isBody
        ? {left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight}
        : target.getBoundingClientRect();
    const pos = position || {x: 'center', y: 'center'};
    const width = overlay.offsetWidth;
    const height = overlay.offsetHeight;
    const pad = padding || 0;

    let left = rect.left;
    let top = rect.top;

    // X positioning
    if(pos.x === 'left')
    {
        left = isBody ? pad : rect.left - width;
    }
    else if(pos.x === 'left-in')
    {
        left = rect.left + pad;
    }
    else if(pos.x === 'center')
    {
        left = rect.left + (rect.width / 2) - (width / 2);
    }
    else if(pos.x === 'right-in')
    {
        left = rect.right - width - pad;
    }
    else if(pos.x === 'right')
    {
        left = isBody ? rect.right - width - pad : rect.right;
    }

    // Y positioning
    if(pos.y === 'top')
    {
        top = isBody ? pad : rect.top - height;
    }
    else if(pos.y === 'top-in')
    {
        top = rect.top + pad;
    }
    else if(pos.y === 'center')
    {
        top = rect.top + (rect.height / 2) - (height / 2);
    }
    else if(pos.y === 'bottom-in')
    {
        top = rect.bottom - height - pad;
    }
    else if(pos.y === 'bottom')
    {
        top = isBody ? rect.bottom - height - pad : rect.bottom;
    }

    left += offset.x || 0;
    top += offset.y || 0;

    return {left: Math.round(left), top: Math.round(top)};
});
