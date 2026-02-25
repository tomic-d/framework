transforms.ItemAdd({
    id: 'ot-chart-pie',
    icon: 'pie_chart',
    name: 'Pie Chart',
    description: 'Circular pie chart visualization. Show proportions and percentages in a circle.',
    js: [
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
    ],
    config: {
        'labels': ['array', ['Category A', 'Category B', 'Category C', 'Category D']],
        'values': ['array', [30, 25, 20, 25]],
        'options': ['object', {}]
    },
    code: function(data, node, transformer)
    {
        this.setup = () =>
        {
            node.innerHTML = '';
            node.classList.add('ot-chart-pie');

            const canvas = document.createElement('canvas');
            this.canvas = canvas;
            node.appendChild(canvas);
        };

        this.colors = () =>
        {
            const style = getComputedStyle(document.body);

            return [
                style.getPropertyValue('--ot-brand').trim(),
                style.getPropertyValue('--ot-blue').trim(),
                style.getPropertyValue('--ot-green').trim(),
                style.getPropertyValue('--ot-orange').trim(),
                style.getPropertyValue('--ot-red').trim()
            ];
        };

        this.dataset = () =>
        {
            const values = data['values'];
            const palette = this.colors();

            const extendedPalette = [];
            for(let i = 0; i < values.length; i++)
            {
                extendedPalette.push(palette[i % palette.length]);
            }

            return {
                data: values,
                backgroundColor: extendedPalette,
                borderColor: '#ffffff',
                borderWidth: 2
            };
        };

        this.config = () =>
        {
            const style = getComputedStyle(document.body);
            const textColor = style.getPropertyValue('--ot-text-1').trim();

            return {
                type: 'pie',
                data: {
                    labels: data['labels'],
                    datasets: [this.dataset()]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                padding: 20,
                                font: {
                                    family: style.getPropertyValue('--ot-font-primary').trim(),
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context)
                                {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return label + ': ' + percentage + '%';
                                }
                            }
                        }
                    },
                    ...data['options']
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
