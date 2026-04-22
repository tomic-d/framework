import onetype from '#framework/load.js';

const playwright = onetype.Addon('playwright', (playwright) =>
{
    playwright.StoreSet('browser', null);
});

export default playwright;
