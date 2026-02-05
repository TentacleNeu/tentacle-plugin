# Tentacle Identity Skill

识别和管理 Neuron 身份的能力。

## 能力描述

此 Skill 用于：
1. 生成稳定的节点 fingerprint
2. 管理多个 Profile 身份
3. 安全存储认证信息

## Fingerprint 生成规则

```
fingerprint = sha256(profileId + ":" + token + ":" + modelTier).substring(0, 16)
```

## 使用场景

- 节点注册时自动调用
- 身份验证
- 多设备同步识别
