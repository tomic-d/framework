import elements from '#elements/load.js';

elements.ItemAdd({
	id: 'comments',
	icon: 'comment',
	name: 'Comments',
	description: 'Comment thread with replies, likes, and timestamps.',
	category: 'Data',
	author: 'Divhunt',
	config: {
		comments: {
			type: 'array',
			value: [
				{
					author: 'Sarah Johnson',
					avatar: '',
					time: '2 hours ago',
					text: 'This looks great! I really like the new design direction. The colors are much more vibrant.',
					likes: 12,
					replies: [
						{
							author: 'John Doe',
							avatar: '',
							time: '1 hour ago',
							text: 'I agree! The color palette is perfect.',
							likes: 5
						},
						{
							author: 'Jane Smith',
							avatar: '',
							time: '30 minutes ago',
							text: 'Thanks for the feedback everyone!',
							likes: 3
						}
					]
				},
				{
					author: 'Mike Chen',
					avatar: '',
					time: '5 hours ago',
					text: 'Can we adjust the spacing on mobile? It feels a bit cramped on smaller screens.',
					likes: 8,
					replies: [
						{
							author: 'Sarah Johnson',
							avatar: '',
							time: '4 hours ago',
							text: 'Good point, I will look into that.',
							likes: 4
						}
					]
				},
				{
					author: 'Emma Davis',
					avatar: '',
					time: '1 day ago',
					text: 'Great work team! This is exactly what we needed. Looking forward to the next iteration.',
					likes: 24,
					replies: []
				}
			]
		},
		variant: {
			type: 'array',
			value: ['border'],
			options: ['border', 'bg-1', 'bg-2', 'bg-3', 'compact']
		}
	},
	render: function()
	{
		this.state = this.state || {};
		this.state.expandedComments = this.state.expandedComments || {};

		this.toggleReplies = (commentId) =>
		{
			this.state.expandedComments[commentId] = !this.state.expandedComments[commentId];
			this.Update();
		};

		return `
			<div class="holder" :variant="variant.join(' ')">
				<div dh-for="comment in comments" class="comment-wrapper">
					<div class="comment">
						<div class="avatar">
							<i dh-if="!comment.avatar" class="icon">person</i>
							<img dh-if="comment.avatar" :src="comment.avatar" alt="Avatar">
						</div>
						<div class="content">
							<div class="header">
								<span class="author">{{ comment.author }}</span>
								<span class="time">{{ comment.time }}</span>
							</div>
							<div class="text">{{ comment.text }}</div>
							<div class="actions">
								<div class="action">
									<i class="icon">thumb_up</i>
									<span>{{ comment.likes }}</span>
								</div>
								<div class="action" dh-if="comment.replies.length > 0" dh-click="toggleReplies(comment.author + comment.time)">
									<i class="icon">{{ state.expandedComments[comment.author + comment.time] ? 'expand_less' : 'expand_more' }}</i>
									<span>{{ comment.replies.length }} {{ comment.replies.length === 1 ? 'reply' : 'replies' }}</span>
								</div>
								<div class="action">
									<i class="icon">more_horiz</i>
								</div>
							</div>
						</div>
					</div>
					<div dh-if="state.expandedComments[comment.author + comment.time] && comment.replies.length > 0" class="replies">
						<div dh-for="reply in comment.replies" class="reply">
							<div class="avatar">
								<i dh-if="!reply.avatar" class="icon">person</i>
								<img dh-if="reply.avatar" :src="reply.avatar" alt="Avatar">
							</div>
							<div class="content">
								<div class="header">
									<span class="author">{{ reply.author }}</span>
									<span class="time">{{ reply.time }}</span>
								</div>
								<div class="text">{{ reply.text }}</div>
								<div class="actions">
									<div class="action">
										<i class="icon">thumb_up</i>
										<span>{{ reply.likes }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
});
