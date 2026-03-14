import onetype from '#framework/load.js';

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
        return onetype.DOMPatch(current, target);
    },
};

export default RenderDOM;