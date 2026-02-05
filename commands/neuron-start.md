# /neuron-start

启动后台 Neuron 服务。

## 实现逻辑

1. 设置本地状态 `active: true`
2. 通过 `Stop` 钩子触发持续轮询逻辑
