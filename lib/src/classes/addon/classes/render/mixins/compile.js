import onetype from '#framework/load.js';

const RenderCompile =
{
    Compile(html, data = null, options = {})
    {
        const element = this.DOMCreateElement(html);

        if(element.nodeType === Node.ELEMENT_NODE)
        {
            Object.entries(this.GetAttributes()).forEach(([key, value]) =>
            {
                element.setAttribute(key, value);
            });

            const prefix = this.GetAddon().GetName().charAt(0).toLowerCase();

            element.classList.add(prefix + '-' + onetype.GenerateHash(this.GetAddon().GetName() + '-' + this.GetName()));
        }

        const compile = {
            element,
            data: this.GetData(),
            nodes: {},
            time: 0,
            walk: true,
            children: true,
            locale: options.locale !== undefined ? options.locale : true,
            key: options.key || null
        };

        if(data)
        {
            compile.data = Object.assign({}, compile.data, data);
        }

        const start = performance.now();

        onetype.Emit('@addon.render.compile.before', this, compile, element, '0');

        this.CompileWalkNodes(element, '0', compile);

        onetype.Emit('@addon.render.compile.after', this, compile, element, '0');

        compile.time = performance.now() - start;

        return compile;
    },

    CompileWalkNodes(node, identifier, compile)
    {
        if(!compile.walk || !node)
        {
            return;
        }

        compile.nodes[identifier] = node;

        const parent = node.parentNode;

        onetype.Emit('@addon.render.compile.node', this, compile, node, identifier);

        if(node.parentNode !== parent)
        {
            return;
        }

        if(node.hasChildNodes() && compile.children)
        {
            const childNodes = Array.from(node.childNodes);

            for(let i = 0; i < childNodes.length; i++)
            {
                this.CompileWalkNodes(childNodes[i], identifier + '-' + i, compile);
            }
        }
        else if(node.hasChildNodes())
        {
            compile.children = true;
        }
    }
};

export default RenderCompile;