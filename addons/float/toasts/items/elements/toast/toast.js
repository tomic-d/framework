onetype.AddonReady('elements', (elements) =>
{
    elements.ItemAdd({
        id: 'toast',
        icon: 'notifications',
        name: 'Toast',
        description: 'Toast notification with type variants and auto-dismiss.',
        category: 'Feedback',
        config: {
            type: {
                type: 'string',
                value: 'info',
                options: ['info', 'success', 'warning', 'error']
            },
            title: {
                type: 'string',
                value: null
            },
            message: {
                type: 'string',
                value: ''
            },
            icon: {
                type: 'string',
                value: null
            },
            closeable: {
                type: 'boolean',
                value: true
            },
            onclose: {
                type: 'function'
            }
        },
        render: function()
        {
            this.handleClose = () =>
            {
                if(this.onclose)
                {
                    this.onclose();
                }
            };

            return `
                <div class="holder" :variant="type">
                    <i ot-if="icon" class="icon">{{ icon }}</i>

                    <div class="content">
                        <div ot-if="title" class="title">{{ title }}</div>
                        <div ot-if="message" class="message">{{ message }}</div>
                    </div>

                    <button ot-if="closeable" class="close" ot-click="handleClose">
                        <i class="icon">close</i>
                    </button>
                </div>
            `;
        }
    });
});
