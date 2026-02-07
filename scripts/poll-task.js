const { callBrainWithRetry } = require('../lib/api.js');

callBrainWithRetry('/api/tasks/poll', 'GET')
  .then(res => {
    console.log(JSON.stringify(res));
  })
  .catch(e => {
    console.error(JSON.stringify({ error: `Poll error: ${e.message}` }));
    process.exit(1);
  });
