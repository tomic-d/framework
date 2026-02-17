divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'heatmap',
        icon: 'gradient',
        name: 'Heatmap',
        description: 'Visual heatmap data representation. Display data density with color-coded intensity maps.',
        js: [
            'https://cdn.jsdelivr.net/npm/heatmap.js@2.0.5/build/heatmap.min.js'
        ],
        config: {
            'data': ['array', []],
            'max-value': ['number', 100],
            'min-opacity': ['number', 0],
            'max-opacity': ['number', 0.6],
            'radius': ['number', 40],
            'blur': ['number', 0.75],
            'gradient': ['object', {}],
            'container-height': ['number', 400],
            'background-color': ['string', 'transparent'],
            'background-image': ['string', ''],
            'click-tracking': ['boolean', false],
            'move-tracking': ['boolean', false],
            'scroll-tracking': ['boolean', false],
            'touch-tracking': ['boolean', false],
            'auto-resize': ['boolean', true],
            'show-tooltip': ['boolean', false],
            'show-legend': ['boolean', false],
            'legend-position': ['string', 'br'], // tl, tr, bl, br
            'debug': ['boolean', false]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.classList.add('heatmap');
                node.classList.add('heatmap-' + identifier);

                // Set container styles
                node.style.position = 'relative';
                node.style.height = data['container-height'].value + 'px';
                node.style.backgroundColor = data['background-color'].value;

                if(data['background-image'].value)
                {
                    node.style.backgroundImage = `url(${data['background-image'].value})`;
                    node.style.backgroundSize = 'cover';
                    node.style.backgroundPosition = 'center';
                }

                // Create heatmap container
                const heatmapContainer = document.createElement('div');
                heatmapContainer.className = 'heatmap-container';
                heatmapContainer.style.position = 'absolute';
                heatmapContainer.style.top = '0';
                heatmapContainer.style.left = '0';
                heatmapContainer.style.width = '100%';
                heatmapContainer.style.height = '100%';

                // Preserve existing content if any
                const children = Array.from(node.children);
                if(children.length > 0)
                {
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'heatmap-content';
                    contentWrapper.style.position = 'relative';
                    contentWrapper.style.zIndex = '2';

                    children.forEach(child => contentWrapper.appendChild(child));
                    node.appendChild(contentWrapper);
                }

                node.insertBefore(heatmapContainer, node.firstChild);
                this.container = heatmapContainer;
            };

            this.gradient = () =>
            {
                const customGradient = data['gradient'].value;

                // Default gradients based on use case
                if(Object.keys(customGradient).length === 0)
                {
                    return {
                        '.00': 'rgb(0,0,255)',
                        '.25': 'rgb(0,255,255)',
                        '.50': 'rgb(0,255,0)',
                        '.75': 'rgb(255,255,0)',
                        '1.0': 'rgb(255,0,0)'
                    };
                }

                return customGradient;
            };

            this.config = () =>
            {
                return {
                    container: this.container,
                    radius: data['radius'].value,
                    maxOpacity: data['max-opacity'].value,
                    minOpacity: data['min-opacity'].value,
                    blur: data['blur'].value,
                    gradient: this.gradient()
                };
            };

            this.sampleData = () =>
            {
                // Generate sample data if none provided
                const width = node.offsetWidth;
                const height = node.offsetHeight;
                const points = [];

                // Create interesting sample pattern
                for(let i = 0; i < 50; i++)
                {
                    points.push({
                        x: Math.floor(Math.random() * width),
                        y: Math.floor(Math.random() * height),
                        value: Math.floor(Math.random() * 100)
                    });
                }

                // Add some hotspots
                for(let i = 0; i < 5; i++)
                {
                    const x = Math.floor(Math.random() * width);
                    const y = Math.floor(Math.random() * height);

                    for(let j = 0; j < 20; j++)
                    {
                        points.push({
                            x: x + (Math.random() - 0.5) * 100,
                            y: y + (Math.random() - 0.5) * 100,
                            value: 80 + Math.floor(Math.random() * 20)
                        });
                    }
                }

                return points;
            };

            this.processData = () =>
            {
                const inputData = data['data'].value;

                if(!inputData || inputData.length === 0)
                {
                    return {
                        max: data['max-value'].value,
                        data: this.sampleData()
                    };
                }

                // Ensure data points have correct format
                const processedData = inputData.map(point => ({
                    x: parseInt(point.x || 0),
                    y: parseInt(point.y || 0),
                    value: parseInt(point.value || 1)
                }));

                return {
                    max: data['max-value'].value,
                    data: processedData
                };
            };

            this.tooltip = () =>
            {
                if(!data['show-tooltip'].value)
                {
                    return;
                }

                const tooltip = document.createElement('div');
                tooltip.className = 'heatmap-tooltip';
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    pointer-events: none;
                    display: none;
                    z-index: 1000;
                `;

                node.appendChild(tooltip);
                this.tooltip = tooltip;

                node.addEventListener('mousemove', (e) =>
                {
                    const rect = node.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const value = this.instance.getValueAt({
                        x: Math.floor(x),
                        y: Math.floor(y)
                    });

                    if(value > 0)
                    {
                        tooltip.textContent = `Value: ${value}`;
                        tooltip.style.left = (x + 10) + 'px';
                        tooltip.style.top = (y - 30) + 'px';
                        tooltip.style.display = 'block';
                    }
                    else
                    {
                        tooltip.style.display = 'none';
                    }
                });

                node.addEventListener('mouseleave', () =>
                {
                    tooltip.style.display = 'none';
                });
            };

            this.legend = () =>
            {
                if(!data['show-legend'].value)
                {
                    return;
                }

                const position = data['legend-position'].value;
                const legend = document.createElement('div');
                legend.className = 'heatmap-legend';

                const positions = {
                    'tl': 'top: 10px; left: 10px;',
                    'tr': 'top: 10px; right: 10px;',
                    'bl': 'bottom: 10px; left: 10px;',
                    'br': 'bottom: 10px; right: 10px;'
                };

                legend.style.cssText = `
                    position: absolute;
                    ${positions[position]}
                    background: rgba(255, 255, 255, 0.9);
                    padding: 10px;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 10;
                `;

                const gradientBar = document.createElement('div');
                gradientBar.style.cssText = `
                    width: 150px;
                    height: 20px;
                    background: linear-gradient(to right,
                        rgb(0,0,255),
                        rgb(0,255,255),
                        rgb(0,255,0),
                        rgb(255,255,0),
                        rgb(255,0,0)
                    );
                    border-radius: 2px;
                    margin-bottom: 5px;
                `;

                const labels = document.createElement('div');
                labels.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #333;
                `;
                labels.innerHTML = `<span>0</span><span>${data['max-value'].value}</span>`;

                legend.appendChild(gradientBar);
                legend.appendChild(labels);
                node.appendChild(legend);
            };

            this.tracking = () =>
            {
                const trackedData = [];
                let tracking = false;

                const addPoint = (e, multiplier = 1) =>
                {
                    const rect = node.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    if(x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)
                    {
                        const point = {
                            x: Math.floor(x),
                            y: Math.floor(y),
                            value: 10 * multiplier
                        };

                        trackedData.push(point);
                        this.instance.addData(point);

                        if(data['debug'].value)
                        {
                            console.log('Heatmap point added:', point);
                        }
                    }
                };

                if(data['click-tracking'].value)
                {
                    node.addEventListener('click', (e) => addPoint(e, 5));
                }

                if(data['move-tracking'].value)
                {
                    node.addEventListener('mousemove', (e) =>
                    {
                        if(Math.random() > 0.95) // Sample 5% of movements
                        {
                            addPoint(e, 1);
                        }
                    });
                }

                if(data['scroll-tracking'].value)
                {
                    let scrollTimer;
                    node.addEventListener('scroll', (e) =>
                    {
                        clearTimeout(scrollTimer);
                        scrollTimer = setTimeout(() =>
                        {
                            const rect = node.getBoundingClientRect();
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2 + node.scrollTop;

                            const point = {
                                x: Math.floor(centerX),
                                y: Math.floor(centerY),
                                value: 20
                            };

                            this.instance.addData(point);
                        }, 100);
                    });
                }

                if(data['touch-tracking'].value)
                {
                    node.addEventListener('touchstart', (e) =>
                    {
                        const touch = e.touches[0];
                        addPoint(touch, 3);
                    });

                    node.addEventListener('touchmove', (e) =>
                    {
                        if(Math.random() > 0.9) // Sample 10% of touch movements
                        {
                            const touch = e.touches[0];
                            addPoint(touch, 1);
                        }
                    });
                }

                // Store tracked data for export
                node.heatmapData = trackedData;
            };

            this.resize = () =>
            {
                if(!data['auto-resize'].value)
                {
                    return;
                }

                let resizeTimer;
                const resizeObserver = new ResizeObserver(() =>
                {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() =>
                    {
                        if(this.instance)
                        {
                            const currentData = this.instance.getData();
                            this.instance.setData(currentData);
                        }
                    }, 250);
                });

                resizeObserver.observe(node);
            };

            this.styles = () =>
            {
                const style = document.createElement('style');

                style.textContent = `
                    .heatmap-${identifier} {
                        position: relative;
                        overflow: hidden;
                    }
                    .heatmap-${identifier} canvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                        pointer-events: ${(data['click-tracking'].value || data['move-tracking'].value) ? 'auto' : 'none'};
                    }
                `;

                document.head.appendChild(style);
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    if(typeof h337 === 'undefined')
                    {
                        console.error('Heatmap.js library not loaded');
                        return;
                    }

                    // Create heatmap instance
                    this.instance = h337.create(this.config());

                    // Set initial data
                    this.instance.setData(this.processData());

                    // Add tooltip
                    this.tooltip();

                    // Add legend
                    this.legend();

                    // Setup tracking
                    this.tracking();

                    // Setup resize handler
                    this.resize();

                    // Expose instance and methods
                    node.heatmap = this.instance;

                    // Add utility methods
                    node.setHeatmapData = (newData) =>
                    {
                        if(this.instance)
                        {
                            this.instance.setData({
                                max: data['max-value'].value,
                                data: newData
                            });
                        }
                    };

                    node.addHeatmapPoint = (point) =>
                    {
                        if(this.instance)
                        {
                            this.instance.addData(point);
                        }
                    };

                    node.clearHeatmap = () =>
                    {
                        if(this.instance)
                        {
                            this.instance.setData({max: 1, data: []});
                        }
                    };

                    node.exportHeatmapData = () =>
                    {
                        return this.instance ? this.instance.getData() : null;
                    };

                    if(data['debug'].value)
                    {
                        console.log('Heatmap initialized:', {
                            id: identifier,
                            config: this.config(),
                            data: this.processData()
                        });
                    }
                }, 100);
            };

            this.setup();
            this.styles();
            this.initialize();
        }
    });
});