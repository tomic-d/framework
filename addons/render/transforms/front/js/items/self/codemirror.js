divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'codemirror',
        icon: 'code',
        name: 'Code Mirror',
        description: 'Advanced code editor with syntax highlighting. Supports multiple languages and themes.',
        js: [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
           
        ],
        css: [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material.min.css'
        ],
        config: {
            'value': ['string', '// Welcome to CodeMirror\nfunction hello() {\n    console.log("Hello, World!");\n}\n\nhello();'],
            'mode': ['string', 'javascript'],
            'theme': ['string', 'monokai'],
            'height': ['number', 400],
            'line-numbers': ['boolean', true],
            'line-wrapping': ['boolean', false],
            'tab-size': ['number', 4],
            'indent-unit': ['number', 4],
            'font-size': ['number', 14],
            'readonly': ['boolean', false],
            'auto-close-brackets': ['boolean', true],
            'match-brackets': ['boolean', true],
            'highlight-active-line': ['boolean', true],
            'smart-indent': ['boolean', true],
            'electric-chars': ['boolean', true],
            'show-cursor-when-selecting': ['boolean', false]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                // Clear existing content
                node.innerHTML = '';

                // Add codemirror wrapper class
                node.classList.add('codemirror-wrapper');

                // Create textarea element
                const textarea = document.createElement('textarea');
                textarea.id = 'codemirror-' + Math.random().toString(36).substring(2, 11);
                textarea.value = data['value'].value || '';

                // Store textarea reference
                this.textarea = textarea;

                // Apply wrapper styles
                const height = data['height'].value;
                node.style.height = height + 'px';
                node.style.border = '1px solid #e0e0e0';
                node.style.borderRadius = '4px';
                node.style.overflow = 'hidden';

                // Append textarea to node
                node.appendChild(textarea);
            };

            this.config = () =>
            {
                const fontSize = data['font-size'].value;

                return {
                    value: data['value'].value || '',
                    mode: data['mode'].value || 'javascript',
                    theme: data['theme'].value || 'monokai',
                    lineNumbers: data['line-numbers'].value !== false,
                    lineWrapping: data['line-wrapping'].value === true,
                    tabSize: data['tab-size'].value || 4,
                    indentUnit: data['indent-unit'].value || 4,
                    readOnly: data['readonly'].value === true,
                    autoCloseBrackets: data['auto-close-brackets'].value !== false,
                    matchBrackets: data['match-brackets'].value !== false,
                    styleActiveLine: data['highlight-active-line'].value !== false,
                    smartIndent: data['smart-indent'].value !== false,
                    electricChars: data['electric-chars'].value !== false,
                    showCursorWhenSelecting: data['show-cursor-when-selecting'].value === true,
                    extraKeys: {
                        'Ctrl-Space': 'autocomplete'
                    }
                };
            };

            this.applyStyles = () =>
            {
                const fontSize = data['font-size'].value;

                // Apply custom font size
                setTimeout(() =>
                {
                    if(this.editor)
                    {
                        const wrapper = this.editor.getWrapperElement();
                        wrapper.style.fontSize = fontSize + 'px';
                        wrapper.style.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", monospace';
                    }
                }, 100);
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    // Check if CodeMirror is available
                    if(typeof CodeMirror === 'undefined')
                    {
                        console.error('CodeMirror library not loaded');
                        node.innerHTML = '<div style="padding: 20px; color: #666;">CodeMirror library not available</div>';
                        return;
                    }

                    try
                    {
                        // Create CodeMirror instance
                        this.editor = CodeMirror.fromTextArea(this.textarea, this.config());

                        // Store instance on node for external access
                        node._codeMirrorEditor = this.editor;

                        // Apply custom styles
                        this.applyStyles();

                        // Set height
                        const height = data['height'].value;
                        this.editor.setSize('100%', height + 'px');

                        // Add helper methods to node
                        node.getValue = () =>
                        {
                            return this.editor ? this.editor.getValue() : '';
                        };

                        node.setValue = (value) =>
                        {
                            if(this.editor && value !== undefined)
                            {
                                this.editor.setValue(String(value));
                            }
                        };

                        node.getMode = () =>
                        {
                            return this.editor ? this.editor.getOption('mode') : '';
                        };

                        node.setMode = (mode) =>
                        {
                            if(this.editor && mode)
                            {
                                this.editor.setOption('mode', String(mode));
                            }
                        };

                        node.setTheme = (theme) =>
                        {
                            if(this.editor && theme)
                            {
                                this.editor.setOption('theme', String(theme));
                            }
                        };

                        node.setReadOnly = (readonly) =>
                        {
                            if(this.editor)
                            {
                                this.editor.setOption('readOnly', Boolean(readonly));
                            }
                        };

                        node.refresh = () =>
                        {
                            if(this.editor)
                            {
                                setTimeout(() =>
                                {
                                    this.editor.refresh();
                                }, 10);
                            }
                        };

                        node.focus = () =>
                        {
                            if(this.editor)
                            {
                                this.editor.focus();
                            }
                        };

                        node.dispose = () =>
                        {
                            if(this.editor)
                            {
                                this.editor.toTextArea();
                                this.editor = null;
                            }
                        };

                        // Auto-refresh when container becomes visible
                        const observer = new IntersectionObserver((entries) =>
                        {
                            entries.forEach(entry =>
                            {
                                if(entry.isIntersecting && this.editor)
                                {
                                    this.editor.refresh();
                                }
                            });
                        });

                        observer.observe(node);

                        console.log('CodeMirror editor initialized successfully');

                    } catch (error) {
                        console.error('CodeMirror initialization failed:', error);
                        node.innerHTML = '<div style="padding: 20px; color: #666;">CodeMirror initialization failed</div>';
                    }
                }, 200);
            };

            this.setup();
            this.initialize();
        }
    });
});