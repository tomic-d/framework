divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'sparkline',
        icon: 'show_chart',
        name: 'Sparkline',
        description: 'Inline mini charts for data trends. Compact line charts perfect for dashboards.',
        js: [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        ],
        config: {
            'values': ['array', [5, 10, 5, 20, 8, 15, 12, 8, 10, 15, 20, 25]],
            'type': ['string', 'line'], // line, bar, area
            'width': ['number', 100],
            'height': ['number', 30],
            'color': ['string', ''], // empty means use theme brand color
            'fill': ['boolean', false],
            'show-dots': ['boolean', false],
            'show-tooltip': ['boolean', true],
            'smooth': ['boolean', true],
            'animate': ['boolean', true],
            'min': ['number', null],
            'max': ['number', null]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.innerHTML = '';
                node.classList.add('sparkline');
                node.classList.add('sparkline-' + identifier);

                // Set inline-block display for sparklines
                node.style.display = 'inline-block';
                node.style.verticalAlign = 'middle';
                node.style.width = data['width'].value + 'px';
                node.style.height = data['height'].value + 'px';

                const canvas = document.createElement('canvas');
                canvas.width = data['width'].value;
                canvas.height = data['height'].value;
                this.canvas = canvas;
                node.appendChild(canvas);
            };

            this.colors = () =>
            {
                const style = getComputedStyle(document.body);

                // Get custom color or default to brand
                let lineColor = data['color'].value;
                if (!lineColor)
                {
                    lineColor = style.getPropertyValue('--dh-brand').trim() || '#3b82f6';
                }

                // Extract RGB values for opacity
                let fillColor = lineColor;
                if (lineColor.startsWith('#'))
                {
                    const r = parseInt(lineColor.slice(1, 3), 16);
                    const g = parseInt(lineColor.slice(3, 5), 16);
                    const b = parseInt(lineColor.slice(5, 7), 16);
                    fillColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
                }
                else if (lineColor.startsWith('rgb'))
                {
                    fillColor = lineColor.replace('rgb', 'rgba').replace(')', ', 0.1)');
                }

                return {
                    line: lineColor,
                    fill: fillColor
                };
            };

            this.dataset = () =>
            {
                const values = data['values'].value;
                const colors = this.colors();
                const type = data['type'].value;
                const smooth = data['smooth'].value;
                const fill = data['fill'].value || type === 'area';
                const showDots = data['show-dots'].value;

                const dataset = {
                    data: values,
                    borderColor: colors.line,
                    backgroundColor: fill ? colors.fill : 'transparent',
                    borderWidth: 1.5,
                    pointRadius: showDots ? 2 : 0,
                    pointHoverRadius: showDots ? 3 : 0,
                    pointBackgroundColor: colors.line,
                    pointBorderColor: colors.line,
                    tension: smooth ? 0.4 : 0,
                    fill: fill
                };

                // Adjust for bar type
                if (type === 'bar')
                {
                    dataset.backgroundColor = colors.line;
                    dataset.borderWidth = 0;
                }

                return dataset;
            };

            this.config = () =>
            {
                const type = data['type'].value === 'area' ? 'line' : data['type'].value;
                const showTooltip = data['show-tooltip'].value;
                const animate = data['animate'].value;
                const minValue = data['min'].value;
                const maxValue = data['max'].value;

                // Generate labels based on data length
                const labels = Array.from({length: data['values'].value.length}, (_, i) => '');

                return {
                    type: type === 'bar' ? 'bar' : 'line',
                    data: {
                        labels: labels,
                        datasets: [this.dataset()]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        animation: {
                            duration: animate ? 750 : 0
                        },
                        interaction: {
                            intersect: false,
                            mode: showTooltip ? 'index' : null
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: showTooltip,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleFont: {
                                    size: 11
                                },
                                bodyFont: {
                                    size: 11
                                },
                                padding: 4,
                                displayColors: false,
                                callbacks: {
                                    title: () => '',
                                    label: (context) => {
                                        return context.parsed.y.toLocaleString();
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: false,
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                display: false,
                                beginAtZero: minValue === null,
                                min: minValue,
                                max: maxValue,
                                grid: {
                                    display: false
                                }
                            }
                        },
                        elements: {
                            line: {
                                borderJoinStyle: 'round'
                            }
                        },
                        layout: {
                            padding: 0
                        }
                    }
                };
            };

            this.styles = () =>
            {
                const style = document.createElement('style');

                style.textContent = `
                    .sparkline-${identifier} {
                        position: relative;
                        line-height: 1;
                    }
                    .sparkline-${identifier} canvas {
                        display: block;
                        max-width: 100%;
                    }
                `;

                document.head.appendChild(style);
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    if(typeof Chart === 'undefined')
                    {
                        console.error('Chart.js library not loaded for sparkline');
                        return;
                    }

                    const context = this.canvas.getContext('2d');
                    this.instance = new Chart(context, this.config());

                    // Expose instance for external access
                    node.sparkline = this.instance;

                    // Add update method for dynamic updates
                    node.updateSparkline = (newValues) =>
                    {
                        if (this.instance)
                        {
                            this.instance.data.datasets[0].data = newValues;
                            this.instance.data.labels = Array.from({length: newValues.length}, () => '');
                            this.instance.update('none'); // Update without animation
                        }
                    };
                }, 100);
            };

            this.setup();
            this.styles();
            this.initialize();
        }
    });
});