onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'ai-chat',
		icon: 'chat',
		name: 'Chat',
		description: 'AI chat interface with task execution.',
		category: 'Global',
		author: 'OneType',
		config: {
			orchestrator: {
				type: 'string',
				value: ''
			},
			placeholder: {
				type: 'string',
				value: 'Type a message...'
			},
			greeting: {
				type: 'string',
				value: ''
			},
			name: {
				type: 'string',
				value: 'Orah'
			},
			version: {
				type: 'string',
				value: ''
			},
			variant: {
				type: 'array',
				value: ['bg-1', 'floating'],
				options: ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'border', 'floating']
			},
			_message: {
				type: 'function'
			},
			_error: {
				type: 'function'
			}
		},
		render: function()
		{
			this.prompt = '';
			this.messages = [];
			this.running = false;
			this.tokens = { input: 0, output: 0 };
			this.step = { current: 0, total: 0 };
			this.elapsed = '';
			this.timer = null;
			this.start = 0;

			/* Timer */

			this.tick = () =>
			{
				if (!this.start) return;

				const seconds = Math.floor((Date.now() - this.start) / 1000);
				const m = Math.floor(seconds / 60);
				const s = seconds % 60;

				this.elapsed = (m > 0 ? m + 'm ' : '') + s + 's';
				this.Update();
			};

			/* Scroll */

			this.scroll = () =>
			{
				requestAnimationFrame(() =>
				{
					const node = this.Element?.querySelector('.messages');

					if (node)
					{
						node.scrollTop = node.scrollHeight;
					}
				});
			};

			/* Markdown */

			this.markdown = (text) =>
			{
				return markdown(text);
			};

			/* Messages */

			this.push = (message) =>
			{
				this.messages.push(message);
				this.Update();
				this.scroll();
			};

			this.last = (type) =>
			{
				for (let i = this.messages.length - 1; i >= 0; i--)
				{
					if (this.messages[i].type === type)
					{
						return this.messages[i];
					}
				}

				return null;
			};

			/* Input */

			this.input = ({ event, value }) =>
			{
				this.prompt = value;
				this.resize(event.target);
			};

			this.keydown = ({ event }) =>
			{
				if (event.key === 'Enter' && !event.shiftKey)
				{
					event.preventDefault();
					this.send();
				}
			};

			this.resize = (node) =>
			{
				node.style.height = 'auto';
				node.style.height = Math.min(node.scrollHeight, 160) + 'px';
			};

			this.clear = () =>
			{
				this.prompt = '';

				requestAnimationFrame(() =>
				{
					const node = this.Element?.querySelector('.composer textarea');

					if (node)
					{
						node.value = '';
						node.style.height = 'auto';
					}
				});
			};

			this.focus = () =>
			{
				requestAnimationFrame(() =>
				{
					const node = this.Element?.querySelector('.composer textarea');

					if (node)
					{
						node.focus();
					}
				});
			};

			/* Send */

			this.send = async () =>
			{
				const text = this.prompt.trim();

				if (!text || this.running)
				{
					return;
				}

				this.push({ type: 'user', content: text });
				this.clear();
				this.running = true;
				this.step = { current: 0, total: 0 };
				this.start = Date.now();
				this.elapsed = '0s';
				this.timer = setInterval(() => this.tick(), 1000);
				this.Update();

				const orchestrator = onetype.Addons().orchestrator;

				if (!orchestrator)
				{
					this.push({ type: 'error', content: 'Orchestrator addon not loaded.' });
					this.running = false;
					clearInterval(this.timer);
					this.Update();
					return;
				}

				const instance = orchestrator.Item('chat');

				if (!instance)
				{
					this.push({ type: 'error', content: 'Orchestrator "' + this.orchestrator + '" not found.' });
					this.running = false;
					clearInterval(this.timer);
					this.Update();
					return;
				}

				instance.Set('prompt', text);
				instance.Set('onTasks', (data) => this.handle('tasks', data));
				instance.Set('onStep', (data) => this.handle('step', data));
				instance.Set('onSummary', (data) => this.handle('summary', data));

				instance.Set('onSuccess', (data) =>
				{
					this.running = false;
					clearInterval(this.timer);

					if (data.state?.tokens)
					{
						this.tokens.input += data.state.tokens.input;
						this.tokens.output += data.state.tokens.output;
					}

					this.Update();
					this.scroll();
					this.focus();
				});

				instance.Set('onFail', (data) =>
				{
					this.running = false;
					clearInterval(this.timer);
					this.push({ type: 'error', content: data.error?.message || 'Something went wrong.' });

					if (this._error)
					{
						this._error(data.error);
					}

					this.focus();
				});

				try
				{
					await instance.Fn('run');
				}
				catch (error)
				{
					/* onFail handles this */
				}
			};

			/* Event handler */

			this.handle = (name, data) =>
			{
				if (name === 'tasks')
				{
					if (data.message)
					{
						this.push({ type: 'assistant', content: data.message });
					}

					if (data.tasks.length > 0)
					{
						this.step.total += data.tasks.length;

						const batch = {
							type: 'batch',
							tasks: data.tasks.map((task) => ({
								agent: task.agent?.id || task.agent,
								task: task.task,
								status: 'pending',
								execution: ''
							})),
							status: 'running',
							done: 0,
							total: data.tasks.length
						};

						this.push(batch);
					}
				}

				if (name === 'step')
				{
					const batch = this.last('batch');

					if (batch)
					{
						const task = batch.tasks.find((t) => t.agent === data.agent && t.task === data.task);

						if (task)
						{
							task.status = data.status;
							task.execution = data.execution || '';
						}

						batch.done = batch.tasks.filter((t) => t.status === 'done').length;

						if (batch.done === batch.total)
						{
							batch.status = 'done';
						}

						if (data.status === 'done')
						{
							this.step.current++;
						}

						this.Update();
						this.scroll();
					}
				}

				if (name === 'summary')
				{
					this.push({ type: 'summary', content: data.summary });
				}

				if (this._message)
				{
					this._message({ name, data });
				}
			};

			/* Helpers */

			this.progress = (message) =>
			{
				if (!message.total) return '0%';
				return Math.round((message.done / message.total) * 100) + '%';
			};

			this.badge = (status) =>
			{
				const map = { pending: 'radio_button_unchecked', running: 'progress_activity', done: 'check_circle' };
				return map[status] || 'circle';
			};

			this.format = (count) =>
			{
				if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
				return String(count);
			};

			return `
				<div :class="'holder ' + variant.join(' ')">
					<div class="topbar">
						<div class="identity">
							<div class="icon"><i>auto_awesome</i></div>
							<span class="label">{{ name }}</span>
							<span :class="'status ' + (running ? 'active' : 'idle')">
								<i class="dot"></i>
								{{ running ? 'working' : 'online' }}
							</span>
						</div>
						<div class="meta">
							<span ot-if="elapsed && running" class="tag session"><i>timer</i>{{ elapsed }}</span>
							<span ot-if="tokens.input || tokens.output" class="tag tokens">{{ format(tokens.input) }} / {{ format(tokens.output) }}</span>
						</div>
					</div>

					<div ot-if="running && step.total" class="infobar">
						<span class="pill step">step {{ step.current }} / {{ step.total }}</span>
					</div>

					<div class="messages">
						<div ot-if="greeting && !messages.length" class="greeting">
							<div class="avatar">
								<i>auto_awesome</i>
							</div>
							<p class="title">How can I help?</p>
							<p class="text">{{ greeting }}</p>
						</div>

						<div ot-for="message in messages" :class="'message ' + message.type">

							<div ot-if="message.type === 'user'" class="row user-row">
								<div class="bubble">
									<span class="content">{{ message.content }}</span>
								</div>
							</div>

							<div ot-if="message.type === 'assistant'" class="row assistant-row">
								<div class="avatar"><i>auto_awesome</i></div>
								<div class="body">
									<span class="label">{{ name }}</span>
									<div class="content" ot-html="message.content"></div>
								</div>
							</div>

							<div ot-if="message.type === 'batch'" class="row">
								<div class="execution">
									<div class="header">
										<div class="left">
											<i :class="message.status === 'done' ? 'done' : 'spin'">{{ message.status === 'done' ? 'check_circle' : 'progress_activity' }}</i>
											<span>{{ message.status === 'done' ? 'Completed' : 'Executing' }}</span>
										</div>
										<span class="counter">{{ message.done }}/{{ message.total }}</span>
									</div>
									<div class="bar"><div class="fill" :style="'width: ' + progress(message)"></div></div>
									<div class="tasks">
										<div ot-for="task in message.tasks" :class="'task ' + task.status">
											<i class="icon">{{ badge(task.status) }}</i>
											<div class="detail">
												<span class="agent">{{ task.agent }}</span>
												<span class="description">{{ task.task }}</span>
											</div>
											<span ot-if="task.execution" class="execution">{{ task.execution }}</span>
										</div>
									</div>
								</div>
							</div>

							<div ot-if="message.type === 'summary'" class="row">
								<div class="result">
									<i class="icon">check_circle</i>
									<div class="content" ot-html="markdown(message.content)"></div>
								</div>
							</div>

							<div ot-if="message.type === 'error'" class="row">
								<div class="fault">
									<i class="icon">warning</i>
									<span class="content">{{ message.content }}</span>
								</div>
							</div>

						</div>

						<div ot-if="running" class="thinking">
							<div class="dots">
								<span></span><span></span><span></span>
							</div>
						</div>
					</div>

					<div class="composer">
						<div class="field">
							<textarea
								:value="prompt"
								:placeholder="placeholder"
								:disabled="running"
								rows="1"
								autocomplete="off"
								ot-input="input"
								ot-keydown="keydown"
							></textarea>
							<div class="actions">
								<button :class="'send' + (running ? ' loading' : '') + (prompt.trim() ? ' active' : '')" :disabled="running || !prompt.trim()" ot-click="send">
									<i ot-if="!running">send</i>
									<i ot-if="running" class="spin">progress_activity</i>
								</button>
							</div>
						</div>
						<div class="footer">
							<span class="brand">OneType {{ name }}{{ version ? ' · v' + version : '' }}</span>
							<div class="hints">
								<span class="hint"><kbd>↵</kbd> send</span>
								<span class="hint"><kbd>⇧↵</kbd> newline</span>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	});
});
