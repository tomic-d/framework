divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'dh-chart-bar',
        icon: 'bar_chart',
        name: 'Bar Chart',
        description: 'Vertical or horizontal bar charts. Compare values across categories with bars.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'labels': ['array', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']],
            'datasets': ['array', []],
            'stacked': ['boolean', false],
            'horizontal': ['boolean', false],
            'options': ['object', {}]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('dh-chart-bar');

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
                    red: style.getPropertyValue('--dh-red').trim()
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
                        data: [42, 56, 28, 84, 65, 39],
                        backgroundColor: palette[0],
                        borderColor: palette[0],
                        borderWidth: 0
                    }];
                }

                return datasets.map((dataset, index) =>
                {
                    const color = palette[index % palette.length];

                    return {
                        ...dataset,
                        backgroundColor: dataset.backgroundColor || color,
                        borderColor: dataset.borderColor || color,
                        borderWidth: dataset.borderWidth || 0
                    };
                });
            };

            this.config = () =>
            {
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--dh-text-1').trim();
                const gridColor = style.getPropertyValue('--dh-bg-3-border').trim();
                const stacked = data['stacked'].value;
                const horizontal = data['horizontal'].value;

                return {
                    type: horizontal ? 'bar' : 'bar',
                    data: {
                        labels: data['labels'].value,
                        datasets: this.datasets()
                    },
                    options: {
                        indexAxis: horizontal ? 'y' : 'x',
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
                            x: {
                                stacked: stacked,
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