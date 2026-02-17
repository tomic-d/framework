overlays.Fn('flip', function(target, overlay, position, offset, padding)
{
    position = position || {x: 'center', y: 'center'};
    padding = padding || 10;

    const width = overlay.offsetWidth;
    const height = overlay.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const pos = {x: position.x, y: position.y};
    let flipped = {x: false, y: false};

    // Calculate initial position
    let result = overlays.Fn('position', target, overlay, pos, offset, padding);

    // Flip Y if needed
    if(pos.y === 'bottom' && (result.top + height) > (viewportHeight - padding))
    {
        pos.y = 'top';
        flipped.y = true;
    }
    else if(pos.y === 'top' && result.top < padding)
    {
        pos.y = 'bottom';
        flipped.y = true;
    }

    // Flip X if needed
    if(pos.x === 'right' && (result.left + width) > (viewportWidth - padding))
    {
        pos.x = 'left';
        flipped.x = true;
    }
    else if(pos.x === 'left' && result.left < padding)
    {
        pos.x = 'right';
        flipped.x = true;
    }

    // Recalculate if flipped
    if(flipped.x || flipped.y)
    {
        result = overlays.Fn('position', target, overlay, pos, offset, padding);
    }

    // Clamp to viewport bounds
    if(result.left < padding)
    {
        result.left = padding;
    }

    if(result.left + width > viewportWidth - padding)
    {
        result.left = viewportWidth - width - padding;
    }

    if(result.top < padding)
    {
        result.top = padding;
    }

    if(result.top + height > viewportHeight - padding)
    {
        result.top = viewportHeight - height - padding;
    }

    return {
        left: Math.round(result.left),
        top: Math.round(result.top),
        position: pos,
        flipped: flipped
    };
});
