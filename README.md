# napcat-plugin-ff14-logs

一个 NapCat 原生插件，用于查询 FF14 Logs 百分位数据。

## 功能

- 查询指定 Boss 与职业的 DPS 百分位
- 支持默认查询和扩展查询
- 仓库内置职业字典和 Boss 字典

## 命令

```text
球鳖 ff14logs boss job [day dps_type]
```

示例：

```text
球鳖 ff14logs p9s 武僧
球鳖 ff14logs p9s 武僧 0 rdps
```

## 配置

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "requestTimeoutMs": 10000,
  "jobDictPath": "./data/job.json",
  "bossDictPath": "./data/boss.json"
}
```

- `enabled`：是否启用
- `commandPrefix`：命令前缀
- `requestTimeoutMs`：请求超时，范围 `1000-30000`
- `jobDictPath`：职业字典路径，默认使用仓库内置文件
- `bossDictPath`：Boss 字典路径，默认使用仓库内置文件

## 数据来源

- FFLogs 页面数据
- 仓库内静态字典 `job.json` / `boss.json`

## 安装

1. 下载当前仓库 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-logs/releases) 中的 `napcat-plugin-ff14-logs.zip`
2. 在 NapCat 插件管理中导入压缩包
3. 启用插件并按需调整配置

## 发布产物

发布包包含：

- `index.mjs`
- `package.json`
- `data/job.json`
- `data/boss.json`

## 已知限制

- 依赖 FFLogs 页面结构，页面改版时可能失效
- 字典文件为静态资源，后续版本更新时可能需要同步维护

## License

MIT
