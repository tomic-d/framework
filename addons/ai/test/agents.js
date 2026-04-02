import ai from '#ai/addon.js';

ai.agents.Item({
	id: 'read-emails',
	name: 'Read Emails',
	description: 'Reads emails by category and returns a list of emails.',
	format: 'json',
	input: {
		category: {
			type: 'string',
			required: true,
			description: 'Email category to filter by (business, personal, support)',
			options: ['business', 'personal', 'support']
		}
	},
	output: {
		emails: {
			type: 'array',
			description: 'List of emails',
			each: {
				type: 'object',
				config: {
					id: { type: 'string', description: 'Email ID' },
					sender: { type: 'string', description: 'Sender email' },
					subject: { type: 'string', description: 'Subject line' },
					body: { type: 'string', description: 'Email body' }
				}
			}
		}
	},
	onAfter: async ({ input, output }) =>
	{
		const database = {
			business: [
				{
					id: 'email-001',
					sender: 'john@acme.com',
					subject: 'Server down - urgent',
					body: 'Hey team, the production server went down at 3:42 AM. Error logs show a memory leak in the payment service. Need someone to look at this ASAP. Customers are getting 502 errors on checkout.'
				},
				{
					id: 'email-002',
					sender: 'sarah@client.io',
					subject: 'New project proposal',
					body: 'Hi, we would like to discuss a new project for our e-commerce platform. Budget is $50k, timeline is 3 months. Can we schedule a call this week?'
				},
				{
					id: 'email-003',
					sender: 'mike@partner.dev',
					subject: 'API integration ready',
					body: 'The payment gateway API integration is complete and tested. All endpoints are live in staging. Ready for your team to review and approve for production deployment.'
				}
			],
			personal: [
				{
					id: 'email-004',
					sender: 'mom@gmail.com',
					subject: 'Dinner on Sunday?',
					body: 'Hey, are you free for dinner this Sunday? Dad is making his famous lasagna.'
				}
			]
		};

		output.emails = database[input.category] || [];
	}
});

ai.agents.Item({
	id: 'summarize',
	name: 'Summarize',
	description: 'Summarizes text into a short, actionable message.',
	format: 'json',
	instructions: 'You receive an email with sender, subject, and body. Write a short 1-2 sentence summary that captures the key point and urgency level. Be direct.',
	tokens: 500,
	input: {
		sender: { type: 'string', description: 'Email sender' },
		subject: { type: 'string', description: 'Email subject' },
		body: { type: 'string', description: 'Email body text' }
	},
	output: {
		summary: { type: 'string', description: 'Short summary of the email' },
		urgent: { type: 'boolean', description: 'Whether the email is urgent' }
	}
});

ai.agents.Item({
	id: 'send-slack',
	name: 'Send Slack',
	description: 'Sends a message to a Slack channel via webhook.',
	format: 'json',
	input: {
		text: {
			type: 'string',
			required: true,
			description: 'Message text to send'
		}
	},
	output: {
		sent: { type: 'boolean', description: 'Whether the message was sent' }
	},
	onAfter: async ({ input, output }) =>
	{
		const response = await fetch(process.env.SLACK_WEBHOOK, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: input.text })
		});

		output.sent = response.ok;
	}
});

ai.agents.Item({
	id: 'create-task',
	name: 'Create Task',
	description: 'Creates a task in the project management system.',
	format: 'json',
	input: {
		title: {
			type: 'string',
			required: true,
			description: 'Task title'
		},
		description: {
			type: 'string',
			description: 'Task description'
		},
		priority: {
			type: 'string',
			value: 'medium',
			description: 'Task priority level',
			options: ['low', 'medium', 'high', 'urgent']
		},
		assignee: {
			type: 'string',
			description: 'Person to assign the task to'
		}
	},
	output: {
		id: { type: 'string', description: 'Created task ID' },
		created: { type: 'boolean', description: 'Whether the task was created' }
	},
	onAfter: async ({ input, output }) =>
	{
		console.log('[TASK CREATED]', input.title, '| priority:', input.priority, '| assignee:', input.assignee || 'unassigned');
		output.id = 'task-' + Date.now();
		output.created = true;
	}
});
