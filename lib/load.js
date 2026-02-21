import Divhunt from './src/divhunt.js';

const divhunt = new Divhunt();

global.$dh = divhunt.$dh;

process.on('SIGINT', async () => 
{
    await divhunt.Middleware('sigint');
    await divhunt.Middleware('shutdown');
    
    process.exit(0);
});

process.on('SIGTERM', async () =>
{
    await divhunt.Middleware('sigterm');
    await divhunt.Middleware('shutdown');

    process.exit(0);
});

process.on('uncaughtException', async (error) =>
{
    await divhunt.Middleware('uncaughtException', { error });
    await divhunt.Middleware('shutdown');

    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', async (reason, promise) =>
{
    await divhunt.Middleware('unhandledRejection', { reason, promise });
    await divhunt.Middleware('shutdown');

    console.error('Unhandled Rejection:', reason);
});

export default divhunt;