import onetype from '#framework/load.js';

const RenderProcess =
{
    Process()
    {
        try
        {
            this.EventEmit('init');

            this.ProcessContext();

            const html = this.ProcessHtml();

            this.Html = html;

            this.EventEmit('render', html);

            const compiled = this.Compile(html);

            this.EventEmit('compile', compiled, false);

            this.Element = compiled.element;

            /* Embedded renders are inserted by their parent, never through Mount(),
               so the DOM observer drives the mount lifecycle exactly once. */

            this.Element.__add = () =>
            {
                if(this.State.mounted)
                {
                    return;
                }

                this.State.mounted = true;
                this.EventEmit('mount');
                this.EventEmit('mounted');
            };

            this.Element.__remove = () => this.Destroy();
            this.Element.__otRender = this;
            this.Nodes = compiled.nodes;
            this.Time = compiled.time;

            this.EventEmit('ready');

            return this;
        }
        catch(error)
        {
            const compiled = this.Compile(this.ProcessError(error.message));

            this.EventEmit('compile', compiled, true);

            this.Element = compiled.element;
            this.Element.__otRender = this;
            this.Nodes = compiled.nodes;
            this.Time = compiled.time;

            this.EventEmit('error', error);

            return this;
        }
    },

    ProcessContext()
    {
        const proto = Object.getPrototypeOf(this);
        const methods = Object.getOwnPropertyNames(proto);

        methods.forEach(method =>
        {
            if(typeof this[method] === 'function' && method !== 'constructor')
            {
                this[method] = this[method].bind(this);
            }
        });
    },

    ProcessHtml()
    {
        this.State.rendering = true;
        const html = this.GetCallback().call(this, this.GetData());
        this.State.rendering = false;

        if(html && typeof html.then === 'function')
        {
            html.then(resolved =>
            {
                if(typeof resolved !== 'string')
                {
                    throw onetype.Error(400, 'Render function must return a string.');
                }

                this.Html = resolved;
                this.Update();
            });

            return '';
        }

        if(typeof html !== 'string')
        {
            throw onetype.Error(400, 'Render function must return a string.');
        }

        return html;
    },

    ProcessError(message)
    {
        const html = `
            <div class="ot-render-error" style="padding: 20px; background: rgb(255 0 0 / 10%); border: 1px solid rgb(255 0 0 / 20%); border-radius: 4px; color: #FF0000; font-family: monospace;">
                <strong>Render Error | Name: ${this.GetName()} | Addon: ${this.GetAddon().GetName()} </strong><br>
                ${onetype.StringSanitize(message)}
            </div>
        `;
        
       return html;
    }
};

export default RenderProcess;