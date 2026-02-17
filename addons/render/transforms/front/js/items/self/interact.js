divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'interact',
        icon: 'gesture',
        name: 'Interact',
        description: 'Drag, resize, and gesture interactions. Make elements draggable, resizable, and interactive.',
        js: [
            'https://cdn.jsdelivr.net/npm/interactjs@1.10.27/dist/interact.min.js'
        ],
        config: {
            'draggable': ['boolean', true],
            'resizable': ['boolean', true],
            'rotatable': ['boolean', false],
            'inertia': ['boolean', true],
            'restrict-to-parent': ['boolean', true],
            'grid-x': ['number', 0],
            'grid-y': ['number', 0],
            'min-width': ['number', 50],
            'min-height': ['number', 50],
            'max-width': ['number', 0],
            'max-height': ['number', 0],
            'resize-from-edges': ['boolean', true],
            'resize-from-corners': ['boolean', true],
            'preserve-aspect-ratio': ['boolean', false]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                // Add interact class and unique identifier
                node.classList.add('interact-element');
                node.classList.add('interact-' + identifier);

                // Set initial position attributes
                node.setAttribute('data-x', '0');
                node.setAttribute('data-y', '0');
                node.setAttribute('data-angle', '0');

                // Add some default styles for visual feedback
                node.style.touchAction = 'none';
                node.style.userSelect = 'none';
                node.style.position = 'relative';

                // Get all children and make them non-interactive
                const children = Array.from(node.children);
                children.forEach(child =>
                {
                    child.style.pointerEvents = 'auto';
                });
            };

            this.draggable = () =>
            {
                if(!data['draggable'].value)
                {
                    return;
                }

                const config = {
                    inertia: data['inertia'].value,
                    listeners: {
                        move: this.dragMoveListener
                    }
                };

                // Add modifiers
                config.modifiers = [];

                // Restrict to parent
                if(data['restrict-to-parent'].value)
                {
                    config.modifiers.push(
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                            endOnly: false
                        })
                    );
                }

                // Grid snapping
                const gridX = data['grid-x'].value;
                const gridY = data['grid-y'].value;

                if(gridX > 0 || gridY > 0)
                {
                    config.modifiers.push(
                        interact.modifiers.snap({
                            targets: [
                                interact.snappers.grid({ x: gridX || 1, y: gridY || 1 })
                            ],
                            range: Infinity,
                            relativePoints: [{ x: 0, y: 0 }]
                        })
                    );
                }

                // Apply draggable configuration
                this.interactInstance.draggable(config);
            };

            this.resizable = () =>
            {
                if(!data['resizable'].value)
                {
                    return;
                }

                const config = {
                    edges: {},
                    listeners: {
                        move: this.resizeMoveListener
                    },
                    modifiers: []
                };

                // Configure resize edges
                if(data['resize-from-edges'].value)
                {
                    config.edges.left = true;
                    config.edges.right = true;
                    config.edges.top = true;
                    config.edges.bottom = true;
                }

                if(data['resize-from-corners'].value)
                {
                    config.edges.left = true;
                    config.edges.right = true;
                    config.edges.top = true;
                    config.edges.bottom = true;
                }

                // Preserve aspect ratio
                if(data['preserve-aspect-ratio'].value)
                {
                    config.modifiers.push(
                        interact.modifiers.aspectRatio({
                            ratio: 'preserve',
                            equalDelta: true
                        })
                    );
                }

                // Restrict edges to parent
                if(data['restrict-to-parent'].value)
                {
                    config.modifiers.push(
                        interact.modifiers.restrictEdges({
                            outer: 'parent'
                        })
                    );
                }

                // Size restrictions
                const minWidth = data['min-width'].value;
                const minHeight = data['min-height'].value;
                const maxWidth = data['max-width'].value;
                const maxHeight = data['max-height'].value;

                const sizeRestrictions = {};

                if(minWidth > 0 || minHeight > 0)
                {
                    sizeRestrictions.min = {};
                    if(minWidth > 0) sizeRestrictions.min.width = minWidth;
                    if(minHeight > 0) sizeRestrictions.min.height = minHeight;
                }

                if(maxWidth > 0 || maxHeight > 0)
                {
                    sizeRestrictions.max = {};
                    if(maxWidth > 0) sizeRestrictions.max.width = maxWidth;
                    if(maxHeight > 0) sizeRestrictions.max.height = maxHeight;
                }

                if(Object.keys(sizeRestrictions).length > 0)
                {
                    config.modifiers.push(
                        interact.modifiers.restrictSize(sizeRestrictions)
                    );
                }

                // Apply resizable configuration
                this.interactInstance.resizable(config);
            };

            this.rotatable = () =>
            {
                if(!data['rotatable'].value)
                {
                    return;
                }

                const config = {
                    listeners: {
                        move: this.rotateMoveListener
                    }
                };

                // Apply gesturable configuration for rotation
                this.interactInstance.gesturable(config);
            };

            // Event listener functions
            this.dragMoveListener = (event) =>
            {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute('data-angle') || 0}deg)`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            };

            this.resizeMoveListener = (event) =>
            {
                const target = event.target;
                let x = parseFloat(target.getAttribute('data-x')) || 0;
                let y = parseFloat(target.getAttribute('data-y')) || 0;

                // Update element size
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // Translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute('data-angle') || 0}deg)`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            };

            this.rotateMoveListener = (event) =>
            {
                const target = event.target;
                const currentAngle = parseFloat(target.getAttribute('data-angle')) || 0;
                const newAngle = currentAngle + event.da;

                const x = parseFloat(target.getAttribute('data-x')) || 0;
                const y = parseFloat(target.getAttribute('data-y')) || 0;

                target.style.transform = `translate(${x}px, ${y}px) rotate(${newAngle}deg)`;

                target.setAttribute('data-angle', newAngle);
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    // Check if interact is available
                    if(typeof interact === 'undefined')
                    {
                        console.error('Interact.js library not loaded');
                        return;
                    }

                    // Initialize interact instance
                    this.interactInstance = interact(node);

                    // Apply configurations
                    this.draggable();
                    this.resizable();
                    this.rotatable();
                }, 100);
            };

            this.setup();
            this.initialize();
        }
    });
});