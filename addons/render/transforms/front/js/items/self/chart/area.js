divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'dh-chart-area',
        icon: 'area_chart',
        name: 'Area Chart',
        description: 'Filled area chart visualization. Show data trends with colored regions under the line.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'labels': ['array', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']],
            'datasets': ['array', []],
            'stacked': ['boolean', false],
            'smooth': ['boolean', true],
            'options': ['object', {}]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('dh-chart-area');

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
                const smooth = data['smooth'].value;

                if(datasets.length === 0)
                {
                    return [{
                        label: 'Sample Data',
                        data: [30, 45, 28, 56, 42, 65],
                        backgroundColor: paletteOpacity[0],
                        borderColor: palette[0],
                        borderWidth: 2,
                        fill: true,
                        tension: smooth ? 0.4 : 0
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
                        borderWidth: dataset.borderWidth || 2,
                        fill: dataset.fill !== undefined ? dataset.fill : true,
                        tension: dataset.tension !== undefined ? dataset.tension : (smooth ? 0.4 : 0)
                    };
                });
            };

            this.config = () =>
            {
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--dh-text-1').trim();
                const gridColor = style.getPropertyValue('--dh-bg-3-border').trim();
                const stacked = data['stacked'].value;

                return {
                    type: 'line',
                    data: {
                        labels: data['labels'].value,
                        datasets: this.datasets()
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: textColor,
                                    font: {
                                        family: style.getPropertyValue('--dh-font-primary').trim()
                                    }
                                }
                            },
                            filler: {
                                propagate: false
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: textColor },
                                grid: { color: gridColor }
                            },
                            y: {
                                stacked: stacked,
                                ticks: { color: textColor },
                                grid: { color: gridColor },
                                beginAtZero: true
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