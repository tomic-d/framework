commands.Fn('api', async function(id, data = {})
{
    try
    {
        const response = await fetch('/api/commands/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, data })
        });

        const result = await response.json();

        if(result.code !== 200)
        {
            throw result.data;
        }

        return { time: result.time, ...result.data };
    }
    catch(error)
    {
        return {
            data: null,
            message: error.message,
            code: 500
        };
    }
});