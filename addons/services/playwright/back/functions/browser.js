import { chromium } from 'playwright';

import playwright from '#playwright/back/addon.js';

playwright.Fn('browser', async function()
{
    let browser = this.StoreGet('browser');

    if(browser && browser.isConnected())
    {
        return browser;
    }

    browser = await chromium.launch({
        headless: true,
        args:
        [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-setuid-sandbox'
        ]
    });

    this.StoreSet('browser', browser);

    return browser;
});
