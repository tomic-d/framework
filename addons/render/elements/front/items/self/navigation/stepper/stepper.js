import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'stepper',
	icon: 'linear_scale',
	name: 'Stepper',
	description: 'Step-by-step progress indicator with customizable steps, icons, and completion states.',
	category: 'Navigation',
	author: 'Divhunt',
	config: {
		steps: {
			type: 'array',
			value: [
				{ label: 'Step 1', description: 'First step', icon: 'looks_one' },
				{ label: 'Step 2', description: 'Second step', icon: 'looks_two' },
				{ label: 'Step 3', description: 'Third step', icon: 'looks_3' }
			],
			each: {
				type: 'object',
				config: {
					label: ['string'],
					description: ['string'],
					icon: ['string']
				}
			}
		},
		step: {
			type: 'number',
			value: 1
		},
		variant: {
			type: 'array',
			value: ['horizontal', 'size-m'],
			options: ['horizontal', 'vertical', 'size-s', 'size-m', 'size-l']
		},
		onChange: {
			type: 'function'
		}
	},
	render: function()
	{
		this.goToStep = (index) =>
		{
			if (index >= 0 && index < this.steps.length)
			{
				this.step = index;
				if (this.onChange)
				{
					this.onChange(index);
				}
			}
		};

		this.getStatus = (index) =>
		{
			if (index < this.step) return 'completed';
			if (index === this.step) return 'current';
			return 'pending';
		};

		this.isCompleted = (index) => index < this.step;

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="step, index in steps" class="step" :status="getStatus(index)" dh-click="() => goToStep(index)">
					<div class="circle">
						<i dh-if="isCompleted(index)" class="icon check">check</i>
						<i dh-if="!isCompleted(index) && step.icon" class="icon">{{ step.icon }}</i>
						<span dh-if="!isCompleted(index) && !step.icon" class="number">{{ index + 1 }}</span>
					</div>

					<div class="content">
						<div class="label">{{ step.label }}</div>
						<div dh-if="step.description" class="description">{{ step.description }}</div>
					</div>

					<div dh-if="index < steps.length - 1" class="connector"></div>
				</div>
			</div>
		`;
	}
});
