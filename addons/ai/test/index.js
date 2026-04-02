import onetype from '#framework/load.js';
global.onetype = onetype;
import ai from '#ai/load.js';
import './agents.js';

console.log('Agents:', Object.keys(ai.agents.Items()));
console.log('Orchestrators:', Object.keys(ai.orchestrators.Items()));
console.log('---');

const general = ai.orchestrators.ItemGet('general');

general.Set('prompt', 'Read my all business emails and send "sender" to slack for each email. But dont sent email, send email length in number of characters');

// general.Set('onTasks', ({ tasks, message }) =>
// {
// 	console.log('[TASKS]', message);
// 	tasks.forEach(t => console.log('  →', t.agent?.id || t.agent, ':', t.task));
// });

// general.Set('onStep', (data) =>
// {
// 	if(data.status === 'planned')
// 	{
// 		console.log('[PLAN]', data.conclusion);
// 		data.steps?.forEach(s => {
// 			if(s.agent) console.log('  →', s.agent, JSON.stringify(s.input || {}).slice(0, 100), s.as ? '→ $' + s.as : '');
// 			if(s.loop) console.log('  ↻', s.loop.goal.slice(0, 80));
// 			if(s.if) console.log('  ?', s.if.input, '→', s.if.goal.slice(0, 80));
// 		});
// 	}
// 	else
// 	{
// 		console.log('[EXEC]', data.agent, ':', data.status, JSON.stringify(data.output)?.slice(0, 150));
// 	}
// });

// general.Set('onSuccess', ({ state }) =>
// {
// 	console.log('[DONE]', 'Tokens:', state.tokens);
// });

// general.Set('onFail', (data) =>
// {
// 	if(data.error)
// 	{
// 		console.log('[FAIL]', data.error.message || data.error);
// 	}
// 	else
// 	{
// 		console.log('[FAIL]', data.conclusion || data.reasoning);
// 	}
// });

try
{
	await general.Fn('run');
}
catch(error)
{
	console.error('[ERROR]', error);
}

process.exit();
