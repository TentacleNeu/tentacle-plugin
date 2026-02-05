# /tentacle-register

在 Brain 服务端注册节点身份。

## 实现逻辑

1. 读取本地配置和当前环境信息
2. 生成 Fingerprint: `hash(email + platform + cpu_arch)`
3. 调用 Brain `/api/neurons/register`
4. 保存返回的 `neuronId` 到本地状态 `state/neuron.local.json`
