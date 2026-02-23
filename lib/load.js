import OneType from './src/onetype.js';

const onetype = new OneType();

global.$ot = onetype.$ot;

process.on('SIGINT', async () => 
{
    await onetype.Middleware('sigint');
    await onetype.Middleware('shutdown');
    
    process.exit(0);
});

process.on('SIGTERM', async () =>
{
    await onetype.Middleware('sigterm');
    await onetype.Middleware('shutdown');

    process.exit(0);
});

process.on('uncaughtException', async (error) =>
{
    await onetype.Middleware('uncaughtException', { error });
    await onetype.Middleware('shutdown');

    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', async (reason, promise) =>
{
    await onetype.Middleware('unhandledRejection', { reason, promise });
    await onetype.Middleware('shutdown');

    console.error('Unhandled Rejection:', reason);
});

export default onetype;