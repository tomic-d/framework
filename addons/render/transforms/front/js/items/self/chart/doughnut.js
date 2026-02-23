onetype.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'ot-chart-doughnut',
        icon: 'donut_large',
        name: 'Doughnut Chart',
        description: 'Ring-shaped doughnut chart. Similar to pie chart with a hollow center.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'labels': ['array', ['Category A', 'Category B', 'Category C', 'Category D']],
            'values': ['array', [30, 25, 20, 25]],
            'cutout': ['string', '50%'],
            'options': ['object', {}]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('ot-chart-doughnut');

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
                const values = data['values'].value;
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
                    type: 'doughnut',
                    data: {
                        labels: data['labels'].value,
                        datasets: [this.dataset()]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: data['cutout'].value,
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