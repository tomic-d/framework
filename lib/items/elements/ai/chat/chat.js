onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'ai-chat',
		icon: 'smart_toy',
		name: 'AI Chat',
		description: 'Chat interface powered by the orchestrator.',
		category: 'AI',
		author: 'OneType',
		config: {
			task: {
				type: 'string',
				value: ''
			},
			orchestrator: {
				type: 'string',
				value: 'chat'
			},
			placeholder: {
				type: 'string',
				value: 'Message Orah...'
			},
			variant: {
				type: 'array',
				value: ['bg-2'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'compact', 'floated']
			},
			_message: {
				type: 'function'
			},
			_done: {
				type: 'function'
			},
			_error: {
				type: 'function'
			},
			debug: {
				type: 'boolean',
				value: false
			}
		},
		render: function()
		{
			this.messages = [];
			this.input = '';
			this.running = false;
			this.steps = [];
			this.error = null;
			this.open = !this.task;

			this.toggle = () =>
			{
				this.open = !this.open;
				this.Update();

				if (this.open)
				{
					this.scroll();
				}
			};

			this.send = async () =>
			{
				const text = this.task || this.input.trim();
				this.input = '';

				if (!text || this.running)
				{
					return;
				}

				this.input = '';
				this.error = null;
				this.running = true;
				this.steps = [];

				this.messages.push({ role: 'user', content: text });
				this.Update();
				this.scroll();

				const field = this.$el?.querySelector('.compose .field');

				if (field)
				{
					field.value = '';
				}

				const orchestrator = onetype.Addon('orchestrator');
				const item = orchestrator.ItemGet(this.orchestrator);

				if(!item)
				{
					this.error = 'Orchestrator "' + this.orchestrator + '" not found';
					this.running = false;
					this.messages.push({ role: 'error', content: this.error });
					this.Update();
					this.scroll();
					return;
				}

				item.Set('task', text);

				item.Set('onDone', () =>
				{
					this.Update();
				});

				item.Set('onAgent', ({ state }) =>
				{
					this.steps.push({ agent: state.agent, goal: null, conclusion: null, status: 'running' });
					this.Update();
					this.scroll();
				});

				item.Set('onGoal', ({ state }) =>
				{
					const current = this.steps[this.steps.length - 1];

					if(current)
					{
						current.goal = state.goal;
						this.Update();
					}
				});

				item.Set('onConclusion', ({ state }) =>
				{
					const current = this.steps[this.steps.length - 1];

					if(current)
					{
						current.conclusion = state.conclusion;
						this.Update();
					}
				});

				item.Set('onStep', () =>
				{
					const current = this.steps[this.steps.length - 1];

					if(current)
					{
						current.status = 'done';
						this.Update();
						this.scroll();
					}
				});

				item.Set('onStop', () =>
				{
					this.running = false;
					this.steps = [];
					this.messages.push({ role: 'assistant', content: 'Stopped.', steps: [] });
					this.Update();
					this.scroll();
				});

				item.Set('onSuccess', ({ state }) =>
				{
					const last = state.history[state.history.length - 1];
					const content = state.summary || this.format(last?.output, last?.conclusion) || 'Done.';

					this.messages.push({ role: 'assistant', content, steps: [...this.steps], tokens: { ...state.tokens } });
					this.running = false;
					this.steps = [];
					this.Update();
					this.scroll();

					if(this._message)
					{
						this._message({ role: 'assistant', content, state });
					}

					if(this._done)
					{
						this._done(state);
					}
				});

				item.Set('onFail', ({ error }) =>
				{
					this.error = error.message || 'Something went wrong';
					this.running = false;
					this.steps = [];
					this.messages.push({ role: 'error', content: this.error });
					this.Update();
					this.scroll();

					if(this._error)
					{
						this._error(error);
					}
				});

				await item.Fn('run');
			};

			this.format = (output, conclusion) =>
			{
				if (!output)
				{
					return conclusion || 'Done.';
				}

				if (typeof output === 'string')
				{
					return output;
				}

				if (output.message)
				{
					return output.message;
				}

				if (output.response)
				{
					return output.response;
				}

				if (output.summary)
				{
					return output.summary;
				}

				if (conclusion)
				{
					return conclusion;
				}

				const keys = Object.keys(output).filter(k => k !== '_meta');

				if (keys.length === 1)
				{
					const val = output[keys[0]];

					return typeof val === 'string' ? val : JSON.stringify(val, null, 2);
				}

				return JSON.stringify(output, null, 2);
			};

			this.key = (e) =>
			{
				if (e.key === 'Enter' && !e.shiftKey)
				{
					e.preventDefault();
					this.send();

					e.target.value = '';
				}
			};

			this.type = (e, ctx) =>
			{
				this.input = ctx.value;
			};

			this.scroll = () =>
			{
				setTimeout(() =>
				{
					const el = this.$el?.querySelector('.messages');

					if (el)
					{
						el.scrollTop = el.scrollHeight;
					}
				}, 50);
			};

			this.expanded = (message) =>
			{
				return message._expanded || false;
			};

			this.toggleSteps = (message) =>
			{
				message._expanded = !message._expanded;
				this.Update();
			};

			this.isFloated = () =>
			{
				return this.variant.includes('floated');
			};

			if (this.task)
			{
				setTimeout(() => this.send(), 0);
			}

			const fab = `
				<button class="fab" ot-click="toggle">
					<img class="logo" src="https://cdn.onetype.ai/brand/logo/icon-orange.svg" alt="Orah" />
				</button>
			`;

			const header = `
				<div class="header">
					<div class="brand">
						<img class="logo" src="https://cdn.onetype.ai/brand/logo/icon-orange.svg" alt="Orah" />
						<div class="info">
							<span class="name">Orah</span>
							<span class="status">{{ running ? 'Thinking...' : 'Online' }}</span>
						</div>
					</div>
					<button ot-if="isFloated()" class="close" ot-click="toggle">
						<i class="icon">close</i>
					</button>
				</div>
			`;

			const welcome = `
				<div ot-if="!messages.length && !running" class="welcome">
					<img class="logo" src="https://cdn.onetype.ai/brand/logo/icon-orange.svg" alt="Orah" />
					<span class="title">Hey, I'm Orah</span>
					<span class="subtitle">How can I help you today?</span>
				</div>
			`;

			const messageList = `
				<div ot-for="message, index in messages" :class="'message ' + message.role">
					<div ot-if="message.role === 'user'" class="bubble user">
						<span class="content">{{ message.content }}</span>
					</div>
					<div ot-if="message.role === 'assistant'" class="bubble assistant">
						<div class="avatar">
							<img src="https://cdn.onetype.ai/brand/logo/icon-orange.svg" alt="Orah" />
						</div>
						<div class="body">
							<span class="content">{{ message.content }}</span>
							<div ot-if="message.steps && message.steps.length" class="meta">
								<span class="toggle" ot-click="toggleSteps(message)">
									<i class="icon">{{ expanded(message) ? 'expand_less' : 'expand_more' }}</i>
									<span class="label">{{ message.steps.length }} step{{ message.steps.length > 1 ? 's' : '' }}</span>
									<span ot-if="message.tokens" class="tokens">{{ message.tokens.input + message.tokens.output }} tok</span>
								</span>
								<div ot-if="expanded(message)" class="timeline">
									<div ot-for="step in message.steps" class="step">
										<i class="dot">check_circle</i>
										<div class="detail">
											<span class="agent">{{ step.agent }}</span>
											<span ot-if="step.conclusion" class="conclusion">{{ step.conclusion }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div ot-if="message.role === 'error'" class="bubble error">
						<i class="icon">error</i>
						<span class="content">{{ message.content }}</span>
					</div>
				</div>
			`;

			const loading = `
				<div ot-if="running" class="message assistant">
					<div class="bubble assistant loading">
						<div class="avatar">
							<img src="https://cdn.onetype.ai/brand/logo/icon-orange.svg" alt="Orah" />
						</div>
						<div class="body">
							<div ot-if="steps.length" class="progress">
								<div ot-for="step in steps" :class="'step ' + step.status">
									<i class="dot">{{ step.status === 'done' ? 'check_circle' : 'pending' }}</i>
									<div class="detail">
										<span class="agent">{{ step.agent }}</span>
										<span ot-if="step.goal" class="goal">{{ step.goal }}</span>
									</div>
								</div>
							</div>
							<div ot-if="!steps.length" class="thinking">
								<span class="dots"><span></span><span></span><span></span></span>
							</div>
						</div>
					</div>
				</div>
			`;

			const compose = `
				<div ot-if="!task" class="compose">
					<input
						class="field"
						type="text"
						:placeholder="placeholder"
						:value="input"
						:disabled="running"
						ot-input="type"
						ot-keydown="key"
					/>
					<button class="submit" :disabled="running || !input.trim()" ot-click="send">
						<i class="icon">arrow_upward</i>
					</button>
				</div>
			`;

			if (this.isFloated())
			{
				return `
					<div :class="'holder ' + variant.join(' ') + (open ? ' open' : '')">
						<div ot-if="open" class="panel">
							${header}
							<div class="messages">
								${welcome}
								${messageList}
								${loading}
							</div>
							${compose}
						</div>
						${fab}
					</div>
				`;
			}

			return `
				<div :class="'holder ' + variant.join(' ')">
					${header}
					<div class="messages">
						${welcome}
						${messageList}
						${loading}
					</div>
					${compose}
				</div>
			`;
		}
	});
});
