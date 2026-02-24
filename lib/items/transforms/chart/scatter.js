onetype.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'ot-chart-scatter',
        icon: 'scatter_plot',
        name: 'Scatter Plot',
        description: 'Scatter plot for correlation data. Show relationship between two variables with points.',
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
                node.classList.add('ot-chart-scatter');

                const canvas = document.createElement('canvas');
                this.canvas = canvas;
                node.appendChild(canvas);
            };

            this.colors = () =>
            {
                const style = getComputedStyle(document.body);

                return {
                    brand: style.getPropertyValue('--ot-brand').trim(),
                    blue: style.getPropertyValue('--ot-blue').trim(),
                    green: style.getPropertyValue('--ot-green').trim(),
                    orange: style.getPropertyValue('--ot-orange').trim(),
                    red: style.getPropertyValue('--ot-red').trim()
                };
            };

            this.datasets = () =>
            {
                const datasets = data['datasets'].value;
                const colors = this.colors();
                const palette = [colors.brand, colors.blue, colors.green, colors.orange, colors.red];

                if(datasets.length === 0)
                {
                    return [{
                        label: 'Sample Data',
                        data: [
                            {x: 10, y: 20},
                            {x: 15, y: 35},
                            {x: 20, y: 30},
                            {x: 25, y: 45},
                            {x: 30, y: 40},
                            {x: 35, y: 55}
                        ],
                        backgroundColor: palette[0],
                        borderColor: palette[0],
                        borderWidth: 1,
                        pointRadius: 5
                    }];
                }

                return datasets.map((dataset, index) =>
                {
                    const color = palette[index % palette.length];

                    return {
                        ...dataset,
                        backgroundColor: dataset.backgroundColor || color,
                        borderColor: dataset.borderColor || color,
                        borderWidth: dataset.borderWidth || 1,
                        pointRadius: dataset.pointRadius || 5
                    };
                });
            };

            this.config = () =>
            {
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--ot-text-1').trim();
                const gridColor = style.getPropertyValue('--ot-bg-3-border').trim();

                return {
                    type: 'scatter',
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
                                        family: style.getPropertyValue('--ot-font-primary').trim()
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