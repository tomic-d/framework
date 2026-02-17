import queue from '#queue/load.js';

const mainQueue = queue.Item({
    id: 'main',
    onTaskStart: (task, batch) => 
    {
    },
    onTaskEnd: (task, batch) => 
    {
    },
    onRun: () => 
    {
    },
    whileRunning: (batch) => 
    {
        console.log('ACTIVE :1', batch.active);
    }
});

mainQueue.Fn('add', null, {}, (data, resolve) => 
{
    setTimeout(() => {
        resolve();
    }, 1500)
});

setInterval(() => 
{
    mainQueue.Fn('add', null, {}, (data, resolve) => 
    {
        setTimeout(() => {
            resolve();
        }, 1500)
    });

}, 1);



// const scrapper = workers.Fn('client.gRPC', '192.168.0.101:50001');

// async function main()
// {
//     try 
//     {
//         const actions = [{
//             name: 'navigate',
//             properties: {
//                 url: 'https://mondorama.rs',
//                 waitUntil: 'networkidle'
//             }
//         }, {
//             name: 'seo',
//         }];

//         const scrape = await scrapper.execute('scrape', {actions});

//         console.log(scrape.data.context.seo);
//     }
//     catch(error)
//     {
//         console.log(error.message);
//     }
// }

// main();