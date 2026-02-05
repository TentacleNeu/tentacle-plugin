# /neuron-mode

进入互动挖矿模式。

## 实现逻辑

1. 检查注册状态，未注册则引导运行 `/tentacle-register`
2. 检查隔离目录 `~/tentacle-workspace/`
3. 设置状态为 `active: true`
4. 进入循环：
   - 调用 `/api/tasks/poll` 获取任务
   - 有任务 -> 执行任务 -> 提交结果 (`/api/tasks/submit`)
   - 无任务 -> 等待 15s-60s (指数退避)
   - 检查空闲轮数，超限则自动停止
