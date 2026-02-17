divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'dh-chart-bubble',
        icon: 'bubble_chart',
        name: 'Bubble Chart',
        description: 'Bubble chart with three dimensions. Display data points as sized bubbles on X/Y axes.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'datasets': ['array', []],
            'options': ['object', {}]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('dh-chart-bubble');

                const canvas = document.createElement('canvas');
                this.canvas = canvas;
                node.appendChild(canvas);
            };

            this.colors = () =>
            {
                const style = getComputedStyle(document.body);

                return {
                    brand: style.getPropertyValue('--dh-brand').trim(),
                    blue: style.getPropertyValue('--dh-blue').trim(),
                    green: style.getPropertyValue('--dh-green').trim(),
                    orange: style.getPropertyValue('--dh-orange').trim(),
                    red: style.getPropertyValue('--dh-red').trim(),
                    brandOpacity: style.getPropertyValue('--dh-brand-opacity').trim(),
                    blueOpacity: style.getPropertyValue('--dh-blue-opacity').trim(),
                    greenOpacity: style.getPropertyValue('--dh-green-opacity').trim(),
                    orangeOpacity: style.getPropertyValue('--dh-orange-opacity').trim(),
                    redOpacity: style.getPropertyValue('--dh-red-opacity').trim()
                };
            };

            this.datasets = () =>
            {
                const datasets = data['datasets'].value;
                const colors = this.colors();
                const palette = [colors.brand, colors.blue, colors.green, colors.orange, colors.red];
                const paletteOpacity = [colors.brandOpacity, colors.blueOpacity, colors.greenOpacity, colors.orangeOpacity, colors.redOpacity];

                if(datasets.length === 0)
                {
                    return [{
                        label: 'Sample Data',
                        data: [
                            {x: 10, y: 20, r: 8},
                            {x: 15, y: 35, r: 12},
                            {x: 20, y: 30, r: 10},
                            {x: 25, y: 45, r: 15},
                            {x: 30, y: 40, r: 6},
                            {x: 35, y: 55, r: 20}
                        ],
                        backgroundColor: paletteOpacity[0],
                        borderColor: palette[0],
                        borderWidth: 2
                    }];
                }

                return datasets.map((dataset, index) =>
                {
                    const color = palette[index % palette.length];
                    const colorOpacity = paletteOpacity[index % paletteOpacity.length];

                    return {
                        ...dataset,
                        backgroundColor: dataset.backgroundColor || colorOpacity,
                        borderColor: dataset.borderColor || color,
                        borderWidth: dataset.borderWidth || 2
                    };
                });
            };

            this.config = () =>
            {
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--dh-text-1').trim();
                const gridColor = style.getPropertyValue('--dh-bg-3-border').trim();

                return {
                    type: 'bubble',
                    data: {
                        datasets: this.datasets()
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: textColor,
                                    font: {
                                        family: style.getPropertyValue('--dh-font-primary').trim()
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context)
                                    {
                                        const label = context.dataset.label || '';
                                        const x = context.parsed.x;
                                        const y = context.parsed.y;
                                        const r = context.raw.r;
                                        return label + ': (x: ' + x + ', y: ' + y + ', size: ' + r + ')';
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                ticks: { color: textColor },
                                grid: { color: gridColor },
                                title: {
                                    display: true,
                                    text: 'X Axis',
                                    color: textColor
                                }
                            },
                            y: {
                                type: 'linear',
                                ticks: { color: textColor },
                                grid: { color: gridColor },
                                title: {
                                    display: true,
                                    text: 'Y Axis',
                                    color: textColor
                                }
                            }
                        },
                        ...data['options'].value
                    }
                };
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    if(typeof Chart === 'undefined')
                    {
                        console.error('Chart.js library not loaded');
                        return;
                    }

                    const context = this.canvas.getContext('2d');
                    this.instance = new Chart(context, this.config());

                    node.chart = this.instance;
                }, 100);
            };

            this.setup();
            this.initialize();
        }
    });
});