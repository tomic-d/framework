import onetype from '#framework/load.js';

import playwright from '#playwright/back/addon.js';

onetype.MiddlewareIntercept('shutdown', async (ctx) =>
{
    const browser = playwright.StoreGet('browser');

    if(browser && browser.isConnected())
    {
        await browser.close();
        playwright.StoreSet('browser', null);
    }

    await ctx.next();
});
