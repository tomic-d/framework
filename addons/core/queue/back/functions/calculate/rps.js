import queue from '#queue/addon.js';

queue.Fn('calculate.rps', function(timestamps = [])
{
    this.methods.calculateRateForWindow = (windowTimestamps) =>
    {
        if(windowTimestamps.length < 2) return 0;
        
        const timeSpanSeconds = (windowTimestamps[windowTimestamps.length - 1] - windowTimestamps[0]) / 1000;
        if(timeSpanSeconds === 0) return 0;
        
        return parseFloat((windowTimestamps.length / timeSpanSeconds).toFixed(2));
    };

    return {
        10: timestamps.length >= 10 ? this.methods.calculateRateForWindow(timestamps.slice(-10)) : null,
        100: timestamps.length >= 100 ? this.methods.calculateRateForWindow(timestamps.slice(-100)) : null,
        250: timestamps.length >= 250 ? this.methods.calculateRateForWindow(timestamps.slice(-250)) : null,
        500: timestamps.length >= 500 ? this.methods.calculateRateForWindow(timestamps.slice(-500)) : null,
        1000: timestamps.length >= 1000 ? this.methods.calculateRateForWindow(timestamps.slice(-1000)) : null,
    };
});