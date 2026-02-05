# /neuron-stop

停止 Neuron 服务。

## 实现逻辑

1. 设置本地状态 `active: false`
2. 等待当前正在执行的任务完成（如果有）
