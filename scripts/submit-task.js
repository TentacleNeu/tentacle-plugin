const { callBrainWithRetry, getState, saveState } = require('../lib/api.js');

const taskId = process.argv[2];
const resultArg = process.argv[3];

if (!taskId) {
  console.error(JSON.stringify({ error: 'Usage: submit-task.js <taskId> <result>' }));
  process.exit(1);
}

if (!resultArg) {
  console.error(JSON.stringify({ error: 'Result is required' }));
  process.exit(1);
}

// 支持通过环境变量传入长文本结果
const result = process.env.TENTACLE_RESULT || resultArg;

callBrainWithRetry('/api/tasks/submit', 'POST', { taskId, result })
  .then(res => {
    // 更新本地统计
    const state = getState();
    const updatedState = {
      ...state,
      completed_tasks: (state.completed_tasks || 0) + 1,
      total_atp: (state.total_atp || 0) + (res.data?.atpEarned || 0)
    };
    saveState(updatedState);

    console.log(JSON.stringify({
      ...res,
      localStats: {
        completed_tasks: updatedState.completed_tasks,
        total_atp: updatedState.total_atp
      }
    }));
  })
  .catch(e => {
    console.error(JSON.stringify({ error: `Submit error: ${e.message}` }));
    process.exit(1);
  });
