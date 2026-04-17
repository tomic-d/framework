import images from '#cloudflare-images/addon.js';

images.Fn('api', async function(method, path, body, headers = {})
{
	const account = process.env.CLOUDFLARE_ACCOUNT_ID;
	const token = process.env.CLOUDFLARE_ACCOUNT_TOKEN;

	if(!account || !token)
	{
		throw new Error('Cloudflare credentials not configured.');
	}

	const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/images/v1${path}`;

	const options = {
		method,
		headers: {
			'Authorization': 'Bearer ' + token,
			...headers
		}
	};

	if(body)
	{
		if(body instanceof FormData)
		{
			options.body = body;
		}
		else
		{
			options.headers['Content-Type'] = 'application/json';
			options.body = JSON.stringify(body);
		}
	}

	const response = await fetch(endpoint, options);
	const result = await response.json();

	if(!result.success)
	{
		const message = result.errors?.[0]?.message || 'Cloudflare API error.';
		throw new Error(message);
	}

	return result.result;
});
