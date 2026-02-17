divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'particles',
        icon: 'blur_on',
        name: 'Particles',
        description: 'Animated particle effects background. Create interactive particle systems with customizable behaviors.',
        js: [
            'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
        ],
        config: {
            'preset': ['string', 'default'],
            'particle-number': ['number', 80],
            'particle-color': ['string', '#ffffff'],
            'particle-opacity': ['number', 0.5],
            'particle-size': ['number', 3],
            'particle-size-random': ['boolean', true],
            'particle-shape': ['string', 'circle'],
            'line-linked': ['boolean', true],
            'line-color': ['string', '#ffffff'],
            'line-opacity': ['number', 0.4],
            'line-width': ['number', 1],
            'line-distance': ['number', 150],
            'move-enable': ['boolean', true],
            'move-speed': ['number', 6],
            'move-direction': ['string', 'none'],
            'move-random': ['boolean', false],
            'move-straight': ['boolean', false],
            'move-bounce': ['boolean', false],
            'move-attract': ['boolean', false],
            'interactivity-hover': ['boolean', true],
            'interactivity-click': ['boolean', true],
            'hover-mode': ['string', 'repulse'],
            'click-mode': ['string', 'push'],
            'retina-detect': ['boolean', true]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                node.classList.add('particles');
                node.classList.add('particles-' + identifier);

                const particlesId = 'particles-' + identifier;
                node.id = particlesId;

                const children = Array.from(node.children);

                if(children.length > 0)
                {
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'particles-content';

                    children.forEach(child =>
                    {
                        contentWrapper.appendChild(child);
                    });

                    node.appendChild(contentWrapper);
                }

                this.particlesId = particlesId;
            };

            this.styles = () =>
            {
                const style = document.createElement('style');

                style.textContent = `
                    .particles-${identifier} {
                        position: relative;
                        width: 100%;
                        height: 100%;
                    }
                    .particles-${identifier} canvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: auto;
                    }
                    .particles-${identifier} .particles-content {
                        position: relative;
                        z-index: 1;
                    }
                `;

                document.head.appendChild(style);
            };

            this.presets = () =>
            {
                const preset = data['preset'].value;

                const presets = {
                    'snow': {
                        particleNumber: 100,
                        particleColor: '#ffffff',
                        particleOpacity: 0.8,
                        particleSize: 4,
                        moveSpeed: 2,
                        moveDirection: 'bottom',
                        lineLinked: false
                    },
                    'stars': {
                        particleNumber: 200,
                        particleColor: '#ffffff',
                        particleOpacity: 1,
                        particleSize: 2,
                        moveSpeed: 0.5,
                        lineLinked: false,
                        particleSizeRandom: true
                    },
                    'bubbles': {
                        particleNumber: 40,
                        particleColor: '#ffffff',
                        particleOpacity: 0.4,
                        particleSize: 8,
                        moveSpeed: 3,
                        moveDirection: 'top',
                        lineLinked: false,
                        particleShape: 'circle'
                    },
                    'network': {
                        particleNumber: 60,
                        particleColor: '#0066cc',
                        particleOpacity: 0.6,
                        lineLinked: true,
                        lineColor: '#0066cc',
                        lineOpacity: 0.3,
                        moveSpeed: 4
                    }
                };

                if(presets[preset])
                {
                    return presets[preset];
                }

                return null;
            };

            this.config = () =>
            {
                const presetConfig = this.presets();

                const particleNumber = presetConfig?.particleNumber || data['particle-number'].value;
                const particleColor = presetConfig?.particleColor || data['particle-color'].value;
                const particleOpacity = presetConfig?.particleOpacity || data['particle-opacity'].value;
                const particleSize = presetConfig?.particleSize || data['particle-size'].value;
                const particleSizeRandom = presetConfig?.particleSizeRandom ?? data['particle-size-random'].value;
                const particleShape = presetConfig?.particleShape || data['particle-shape'].value;
                const lineLinked = presetConfig?.lineLinked ?? data['line-linked'].value;
                const lineColor = presetConfig?.lineColor || data['line-color'].value;
                const lineOpacity = presetConfig?.lineOpacity || data['line-opacity'].value;
                const lineWidth = data['line-width'].value;
                const lineDistance = data['line-distance'].value;
                const moveSpeed = presetConfig?.moveSpeed || data['move-speed'].value;
                const moveDirection = presetConfig?.moveDirection || data['move-direction'].value;
                const moveRandom = data['move-random'].value;
                const moveStraight = data['move-straight'].value;
                const moveBounce = data['move-bounce'].value;
                const moveAttract = data['move-attract'].value;

                const config = {
                    particles: {
                        number: {
                            value: particleNumber,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: particleColor
                        },
                        shape: {
                            type: particleShape,
                            stroke: {
                                width: 0,
                                color: '#000000'
                            }
                        },
                        opacity: {
                            value: particleOpacity,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false
                            }
                        },
                        size: {
                            value: particleSize,
                            random: particleSizeRandom,
                            anim: {
                                enable: false,
                                speed: 40,
                                size_min: 0.1,
                                sync: false
                            }
                        },
                        line_linked: {
                            enable: lineLinked,
                            distance: lineDistance,
                            color: lineColor,
                            opacity: lineOpacity,
                            width: lineWidth
                        },
                        move: {
                            enable: data['move-enable'].value,
                            speed: moveSpeed,
                            direction: moveDirection,
                            random: moveRandom,
                            straight: moveStraight,
                            out_mode: 'out',
                            bounce: moveBounce,
                            attract: {
                                enable: moveAttract,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: {
                                enable: data['interactivity-hover'].value,
                                mode: data['hover-mode'].value
                            },
                            onclick: {
                                enable: data['interactivity-click'].value,
                                mode: data['click-mode'].value
                            },
                            resize: true
                        },
                        modes: {
                            grab: {
                                distance: 400,
                                line_linked: {
                                    opacity: 1
                                }
                            },
                            bubble: {
                                distance: 400,
                                size: 40,
                                duration: 2,
                                opacity: 8,
                                speed: 3
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4
                            },
                            push: {
                                particles_nb: 4
                            },
                            remove: {
                                particles_nb: 2
                            }
                        }
                    },
                    retina_detect: data['retina-detect'].value
                };

                return config;
            };

            this.initialize = () =>
            {
                setTimeout(() =>
                {
                    if(typeof particlesJS === 'undefined')
                    {
                        console.error('Particles.js library not loaded');
                        return;
                    }

                    particlesJS(this.particlesId, this.config());

                    node._particlesInstance = {
                        refresh: () =>
                        {
                            if(window.pJSDom && window.pJSDom.length > 0)
                            {
                                window.pJSDom.forEach(instance =>
                                {
                                    if(instance.pJS && instance.pJS.canvas && instance.pJS.canvas.el)
                                    {
                                        if(instance.pJS.canvas.el.parentNode && instance.pJS.canvas.el.parentNode.id === this.particlesId)
                                        {
                                            instance.pJS.fn.vendors.destroypJS();
                                            window.pJSDom = window.pJSDom.filter(item => item !== instance);
                                        }
                                    }
                                });
                            }
                            particlesJS(this.particlesId, this.config());
                        },
                        update: (newConfig) =>
                        {
                            if(window.pJSDom && window.pJSDom.length > 0)
                            {
                                window.pJSDom.forEach(instance =>
                                {
                                    if(instance.pJS && instance.pJS.canvas && instance.pJS.canvas.el)
                                    {
                                        if(instance.pJS.canvas.el.parentNode && instance.pJS.canvas.el.parentNode.id === this.particlesId)
                                        {
                                            Object.assign(instance.pJS.particles, newConfig.particles);
                                            instance.pJS.fn.particlesRefresh();
                                        }
                                    }
                                });
                            }
                        }
                    };
                }, 0);
            };

            this.setup();
            this.styles();
            this.initialize();
        }
    });
});