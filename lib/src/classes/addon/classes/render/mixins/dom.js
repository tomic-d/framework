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
        return this.Addon.onetype.DOMPatch(current, target);
    },
};

export default RenderDOM;