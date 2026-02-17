// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

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

        if(typeof html !== 'string')
        {
            throw new Error('Render function must return a string');
        }

        return html;
    },

    ProcessError(message)
    {
        const html = `
            <div class="dh-render-error" style="padding: 20px; background: rgb(255 0 0 / 10%); border: 1px solid rgb(255 0 0 / 20%); border-radius: 4px; color: #FF0000; font-family: monospace;">
                <strong>Render Error | Name: ${this.GetName()} | Addon: ${this.GetAddon().GetName()} </strong><br>
                ${this.GetDivhunt().StringSanitize(message)}
            </div>
        `;
        
       return html;
    }
};

export default RenderProcess;