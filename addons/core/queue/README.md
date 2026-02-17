# Queue

A lightweight task queue management system for handling asynchronous operations with concurrency control.

## Usage

Create a queue instance:

```javascript
const myQueue = queue.Item(
{
    id: 'my-queue',
    concurrency: 5,
    timeout: 3000,
    onTaskStart: (task, batch) => 
    {
        console.log(`Task ${task.id} started`);
    },
    onTaskEnd: (task, batch) => 
    {
        console.log(`Task ${task.id} ended, success: ${task.success}`);
    },
    onEmpty: (batch) => 
    {
        console.log('Queue is empty');
    }
});
```

Add tasks to the queue:

```javascript
myQueue.Fn('add', null, { url: 'https://example.com' }, (data, resolve) => 
{
    try 
    {
        fetch(data.url).then(response => 
        {
            if (!response.ok) throw new Error('Network response failed');
            return response.json();
        })
        .then(result => 
        {
            resolve(); // Tasks completed
        })
        .catch(error => 
        {
            throw new Error(`Fetch failed: ${error.message}`);
        });
    } 
    catch (error) 
    {
        // Task wont fail since error hasn't been throw, but timeout will kick in
        console.error(error);
    }
});
```

## Configuration

The queue accepts the following configuration options:

- `id`: Unique identifier for the queue
- `concurrency`: Maximum number of tasks to process simultaneously (default: 10)
- `timeout`: Task timeout in milliseconds (default: 5000)
- `running`: Whether the queue is actively processing tasks (default: true)

## Events

Callback functions that can be defined:

- `onTaskStart`: Called when a task begins processing
- `onTaskEnd`: Called when a task completes (success or failure)
- `onEmpty`: Called when the queue becomes empty
- `onRun`: Called when the queue starts processing a batch of tasks
- `whileRunning`: Called periodically while tasks are being processed

## Task Format

Tasks have the following properties:

- `id`: Unique identifier (auto-generated if null is provided)
- `data`: Custom data passed to the task callback
- `callback`: Function to execute the task logic
- `success`: Result status after completion
- `duration`: Processing time in milliseconds

## Batch Statistics

During processing, the batch object provides:

- `active`: Number of currently running tasks
- `processed`: Total completed tasks in current batch
- `succeeded`: Number of successful tasks
- `failed`: Number of failed tasks
- `reset()`: Method to reset batch counters

## Error Handling

Tasks automatically fail when an error is thrown within the callback function. Use try/catch blocks and throw appropriate errors:

```javascript
myQueue.Fn('add', null, data, (data, resolve) => 
{
    try 
    {
        // Task logic
        if (!data.isValid) 
        {
            throw new Error('Invalid data provided');
        }
        resolve();
    } 
    catch (error) 
    {
        // Will be captured by queue error handling
        throw new Error(`Task failed: ${error.message}`);
    }
});
```

## Utility Functions

The queue includes utility functions:

### Calculate Requests Per Second

```javascript
const timestamps = [/* array of task completion timestamps */];
const rps = myQueue.Fn('calculate.rps', timestamps);
console.log(rps[100]); // RPS over the last 100 tasks
```

### Calculate Average Response Time

```javascript
const durations = [/* array of task durations */];
const art = myQueue.Fn('calculate.art', durations);
console.log(art[100]); // Average response time over the last 100 tasks
```

## Controlling Queue Execution

Pause queue processing:

```javascript
myQueue.Set('running', false);
```

Resume queue processing:

```javascript
myQueue.Set('running', true);
```

## Advanced Example

Here's a complete example of a queue that processes web requests:

```javascript
import queue from '#queue/load.js';

const scrapeQueue = queue.Item(
{
    id: 'scraper',
    concurrency: 3,
    timeout: 10000,
    onTaskStart: (task, batch) => 
    {
        console.log(`Scraping ${task.data.url}`);
    },
    onTaskEnd: (task, batch) => 
    {
        console.log(`Completed ${task.data.url} in ${task.duration}ms`);
        console.log(`Batch stats - Active: ${batch.active}, Succeeded: ${batch.succeeded}, Failed: ${batch.failed}`);
    },
    onEmpty: (batch) => 
    {
        console.log('All scraping tasks completed');
    },
    onRun: (batch) => 
    {
        console.log('Starting batch processing');
    },
    whileRunning: (batch) => 
    {
        console.log(`Processing... ${batch.active} tasks active`);
    }
});

// Add multiple tasks
const urls = [
    'https://example.com',
    'https://example.org',
    'https://example.net'
];

urls.forEach(url => 
{
    scrapeQueue.Fn('add', null, { url }, async (data, resolve) => 
    {
        try 
        {
            const response = await fetch(data.url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const html = await response.text();
            // Process HTML
            resolve();
        } 
        catch (error) 
        {
            throw new Error(`Scrape failed for ${data.url}: ${error.message}`);
        }
    });
});
```