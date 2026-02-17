// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderDOM =
{
    DOMCreateElement(html)
    {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div;
    },

    DOMPatchElement(current, target)
    {
        return this.Addon.divhunt.DOMPatch(current, target);
    },
};

export default RenderDOM;