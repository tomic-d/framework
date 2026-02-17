import queue from '#queue/addon.js';

queue.Fn('calculate.art', function(durations = [])
{
    return {
        10: durations.length >= 10 ? parseFloat((durations.slice(-10).reduce((sum, t) => sum + t, 0) / 10).toFixed(2)) : null,
        100: durations.length >= 100 ? parseFloat((durations.slice(-100).reduce((sum, t) => sum + t, 0) / 100).toFixed(2)) : null,
        250: durations.length >= 250 ? parseFloat((durations.slice(-250).reduce((sum, t) => sum + t, 0) / 250).toFixed(2)) : null,
        500: durations.length >= 500 ? parseFloat((durations.slice(-500).reduce((sum, t) => sum + t, 0) / 500).toFixed(2)) : null,
        1000: durations.length >= 1000 ? parseFloat((durations.slice(-1000).reduce((sum, t) => sum + t, 0) / 1000).toFixed(2)) : null
    };
});
