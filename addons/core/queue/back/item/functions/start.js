import queue from '#queue/addon.js';

queue.Fn('item.start', async function(item)
{
    const batch = {
        active: 0,
        processed: 0,
        succeeded: 0, 
        failed: 0, 
        reset: function()
        {
            item.Get('onReset') && item.Get('onReset')(batch);

            this.active = 0;
            this.processed = 0;
            this.succeeded = 0;
            this.failed = 0;
        }
    };

    this.methods.runTask = (task) => 
    {
        return new Promise((resolve, reject) => 
        {
            let ended = false;

            const timeout = setTimeout(() => 
            { 
                ended = true;
                reject(new Error('Task timeout'));
            }, item.Get('timeout'));

            try
            {
                task.callback(task.data, () => 
                { 
                    clearTimeout(timeout); 

                    if(!ended)
                    {
                        resolve();
                    }
                });
            }
            catch(error)
            {
                clearTimeout(timeout);
                reject(error);
            }
        });
    };

    this.methods.processNextTask = async () => 
    {
        if(!item.Get('tasks').length) 
        {
            return false;
        }
        
        const task = item.Get('tasks').shift();
        const now = performance.now();

        batch.active++;

        item.Get('onTaskStart') && item.Get('onTaskStart')(task, batch);

        try
        {
            await this.methods.runTask(task);

            batch.succeeded++;
            task.success = true;
        }
        catch(error)
        {
            batch.failed++;
            task.success = false;
        }
        finally
        {
            task.duration = performance.now() - now;

            batch.active--;
            batch.processed++;
           
            item.Get('onTaskEnd') && item.Get('onTaskEnd')(task, batch);
            
            if(item.Get('tasks').length && item.Get('running'))
            {
                this.methods.processNextTask();
            }
        }
    };
    
    this.methods.run = async () => 
    {
        batch.reset();

        if(!item.Get('tasks').length)
        {
            item.Get('onEmpty') && item.Get('onEmpty')(batch);
            return false;
        }
        
        item.Get('onRun') && item.Get('onRun')(batch);
        
        const concurrency = Math.min(item.Get('concurrency'), item.Get('tasks').length);

        for(let i = 0; i < concurrency; i++)
        {
            this.methods.processNextTask();
        }
        
        while(batch.active > 0)
        {
            item.Get('whileRunning') && item.Get('whileRunning')(batch);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return item.Get('tasks').length > 0;
    };
    
    while(true)
    {
        if(!item.Get('running'))
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        else
        {
            const remain = await this.methods.run();
            await new Promise(resolve => setTimeout(resolve, remain ? 10 : 100));
        }
    }
});