// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

window.divhunt = window.divhunt = new Divhunt();

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initBrowser);
}
else
{
    initBrowser();
}

function initBrowser()
{
    divhunt.Addon('browser', function(addon)
    {
        addon.Render('body', () =>
        {
            return document.body.outerHTML;
        });

        const render = addon.Render('body', window);
        document.body.replaceChildren(...render.Element.children);
    });
}
