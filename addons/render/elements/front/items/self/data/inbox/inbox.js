import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'inbox',
	icon: 'inbox',
	name: 'Inbox',
	description: 'Message inbox with sender/recipient info and reply textarea.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		subject: {
			type: 'string',
			value: 'Project Requirements Discussion'
		},
		recipient: {
			type: 'string',
			value: 'John Smith'
		},
		messages: {
			type: 'array',
			value: [
				{
					sender: 'John Smith',
					avatar: '',
					time: '10:30 AM',
					message: 'Hey, I wanted to discuss the new project requirements with you. Do you have time this afternoon?',
					isMe: false
				},
				{
					sender: 'Me',
					avatar: '',
					time: '10:32 AM',
					message: 'Sure! I am free after 3 PM. Should we schedule a quick call?',
					isMe: true
				},
				{
					sender: 'John Smith',
					avatar: '',
					time: '10:35 AM',
					message: 'Perfect! I will send you a calendar invite. Thanks!',
					isMe: false
				}
			]
		},
		placeholder: {
			type: 'string',
			value: 'Type your message...'
		},
		variant: {
			type: 'array',
			value: ['border', 'compact'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'compact']
		}
	},
	render: function()
	{
		return `
			<div class="holder" :variant="variant.join(' ')">
				<div class="header">
					<div class="info">
						<h3 class="subject">{{ subject }}</h3>
						<div class="meta">
							<span class="label">To:</span>
							<span class="value">{{ recipient }}</span>
						</div>
					</div>
					<div class="actions">
						<e-button :variant="['outline', 'size-s']">
							<i class="icon">archive</i>
						</e-button>
						<e-button :variant="['outline', 'size-s']">
							<i class="icon">delete</i>
						</e-button>
					</div>
				</div>
				<div class="messages">
					<div dh-for="msg in messages" class="message" :sender="msg.isMe ? 'me' : 'them'">
						<div class="avatar">
							<i dh-if="!msg.avatar" class="icon">person</i>
							<img dh-if="msg.avatar" :src="msg.avatar" alt="Avatar">
						</div>
						<div class="content">
							<div class="msg-header">
								<span class="sender">{{ msg.sender }}</span>
								<span class="time">{{ msg.time }}</span>
							</div>
							<div class="bubble">{{ msg.message }}</div>
						</div>
					</div>
				</div>
				<div class="composer">
					<e-textarea :placeholder="placeholder" :variant="['border']" rows="3"></e-textarea>
					<div class="composer-actions">
						<div class="left">
							<e-button :variant="['ghost', 'size-s']">
								<i class="icon">attach_file</i>
							</e-button>
							<e-button :variant="['ghost', 'size-s']">
								<i class="icon">image</i>
							</e-button>
						</div>
						<e-button :variant="['brand']">
							<i class="icon">send</i>
							Send
						</e-button>
					</div>
				</div>
			</div>
		`;
	}
});
