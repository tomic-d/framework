divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'dh-chart-radar',
        icon: 'radar',
        name: 'Radar Chart',
        description: 'Spider/radar chart visualization. Display multivariate data in a radial layout.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'labels': ['array', ['Speed', 'Strength', 'Defense', 'Attack', 'Agility']],
            'datasets': ['array', []],
            'fill': ['boolean', true],
            'options': ['object', {}]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('dh-chart-radar');

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
                const fill = data['fill'].value;

                if(datasets.length === 0)
                {
                    return [{
                        label: 'Sample Data',
                        data: [75, 60, 85, 70, 80],
                        backgroundColor: fill ? paletteOpacity[0] : 'transparent',
                        borderColor: palette[0],
                        borderWidth: 2,
                        pointBackgroundColor: palette[0],
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: palette[0]
                    }];
                }

                return datasets.map((dataset, index) =>
                {
                    const color = palette[index % palette.length];
                    const colorOpacity = paletteOpacity[index % paletteOpacity.length];

                    return {
                        ...dataset,
                        backgroundColor: dataset.backgroundColor || (fill ? colorOpacity : 'transparent'),
                        borderColor: dataset.borderColor || color,
                        borderWidth: dataset.borderWidth || 2,
                        pointBackgroundColor: dataset.pointBackgroundColor || color,
                        pointBorderColor: dataset.pointBorderColor || '#fff',
                        pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || '#fff',
                        pointHoverBorderColor: dataset.pointHoverBorderColor || color
                    };
                });
            };

            this.config = () =>
            {
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--dh-text-1').trim();
                const gridColor = style.getPropertyValue('--dh-bg-3-border').trim();

                return {
                    type: 'radar',
                    data: {
                        labels: data['labels'].value,
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
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    color: gridColor
                                },
                                grid: {
                                    color: gridColor
                                },
                                pointLabels: {
                                    color: textColor
                                },
                                ticks: {
                                    color: textColor,
                                    backdropColor: 'transparent'
                                },
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