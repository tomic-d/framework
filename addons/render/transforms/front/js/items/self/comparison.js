divhunt.AddonReady('transforms', (transforms) =>
{
    transforms.ItemAdd({
        id: 'comparison',
        icon: 'compare_arrows',
        name: 'Comparison',
        description: 'Side-by-side comparison widget. Compare features, prices, or data in an interactive layout.',
        js: [
            'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js'
        ],
        css: [
            'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/styles.css'
        ],
        config: {
            'before-image': ['string', 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            'after-image': ['string', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            'before-label': ['string', 'Before'],
            'after-label': ['string', 'After'],
            'start-position': ['number', 50],
            'hover-enabled': ['boolean', true],
            'handle-color': ['string', '#ffffff'],
            'divider-color': ['string', '#ffffff'],
            'divider-width': ['number', 2],
            'keyboard-enabled': ['boolean', true]
        },
        code: function(data, item, compile, node, identifier)
        {
            this.setup = () =>
            {
                // Create the custom element wrapper
                const slider = document.createElement('img-comparison-slider');

                // Create before image
                const beforeImage = document.createElement('img');
                beforeImage.setAttribute('slot', 'first');
                beforeImage.src = data['before-image'].value;
                beforeImage.alt = data['before-label'].value;

                // Create after image
                const afterImage = document.createElement('img');
                afterImage.setAttribute('slot', 'second');
                afterImage.src = data['after-image'].value;
                afterImage.alt = data['after-label'].value;

                // Append images to slider
                slider.appendChild(beforeImage);
                slider.appendChild(afterImage);

                // Clear node and append slider
                node.innerHTML = '';
                node.appendChild(slider);

                // Store reference for later configuration
                this.slider = slider;
            };

            this.labels = () =>
            {
                const beforeLabel = data['before-label'].value;
                const afterLabel = data['after-label'].value;

                if(beforeLabel && beforeLabel !== 'Before')
                {
                    this.slider.setAttribute('data-first-label', beforeLabel);
                }

                if(afterLabel && afterLabel !== 'After')
                {
                    this.slider.setAttribute('data-second-label', afterLabel);
                }
            };

            this.styles = () =>
            {
                const handleColor = data['handle-color'].value;
                const dividerColor = data['divider-color'].value;
                const dividerWidth = data['divider-width'].value;

                const styles = [];

                if(handleColor !== '#ffffff')
                {
                    styles.push(`--handle-color: ${handleColor}`);
                }

                if(dividerColor !== '#ffffff')
                {
                    styles.push(`--divider-color: ${dividerColor}`);
                }

                if(dividerWidth !== 2)
                {
                    styles.push(`--divider-width: ${dividerWidth}px`);
                }

                if(styles.length > 0)
                {
                    this.slider.style.cssText = styles.join('; ');
                }
            };

            this.attributes = () =>
            {
                const startPosition = data['start-position'].value;
                const hoverEnabled = data['hover-enabled'].value;
                const keyboardEnabled = data['keyboard-enabled'].value;

                if(startPosition !== 50)
                {
                    this.slider.setAttribute('value', startPosition);
                }

                if(!hoverEnabled)
                {
                    this.slider.setAttribute('hover', 'false');
                }

                if(!keyboardEnabled)
                {
                    this.slider.setAttribute('keyboard', 'false');
                }
            };

            this.initialize = () =>
            {
                // Add wrapper class to node for styling if needed
                node.classList.add('comparison-wrapper');

                // Set width/height on wrapper if needed
                node.style.display = 'block';
                node.style.width = '100%';
                node.style.maxWidth = '100%';
            };

            this.setup();
            this.labels();
            this.styles();
            this.attributes();
            this.initialize();
        }
    });
});