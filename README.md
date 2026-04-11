# napcat-plugin-ff14-logs

一个给 NapCat 用的 FF14 Logs 百分位查询插件。它适合已经在群里有 FF14 玩家，只想快速查某个 Boss、某个职业的大致表现，不想每次都自己去翻网页。

## 这份 README 默认把你当作

- 已经装好了 NapCat，会导入插件 zip
- 会在群里发命令，但不想先看源码
- 知道自己想查哪个 Boss、哪个职业

## 这个插件适合谁

适合：

- 想在群里快速查 FF14 Logs 百分位
- 想用常见 Boss 简称和职业名直接查
- 不想再额外配 API Key

不太适合：

- 想做完整战斗分析的人
- 想查很多自定义统计维度的人

## 装之前要准备什么

这个插件几乎没有额外前置要求。

你只需要知道：

- 要查的 Boss 名或常见简称，比如 `p9s`
- 要查的职业名，比如 `武僧`

仓库里已经带了职业字典和 Boss 字典，普通使用不用自己准备数据文件。

## 安装

### 1. 下载插件

从 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-logs/releases) 下载：

- `napcat-plugin-ff14-logs.zip`

### 2. 导入 NapCat

在 NapCat 插件管理里导入 zip，并启用插件。

### 3. 保持默认配置先试

第一次建议先不要折腾配置，直接用默认值：

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "requestTimeoutMs": 10000,
  "jobDictPath": "./data/job.json",
  "bossDictPath": "./data/boss.json"
}
```

普通用户最常改的只有：

- `commandPrefix`
- `requestTimeoutMs`

`jobDictPath` 和 `bossDictPath` 一般保持默认就够了。

## 怎么用

最简单的格式是：

```text
球鳖 ff14logs boss job
```

例如：

```text
球鳖 ff14logs p9s 武僧
球鳖 ff14logs p9s 武僧 0 rdps
```

如果你只是第一次上手，**先记前三段就够了**：

- `ff14logs`
- `boss`
- `job`

后面的 `day` 和 `dps_type` 是进阶参数，不懂可以先不填。

## 第一次怎么确认自己装好了

直接在群里试一条：

```text
球鳖 ff14logs p9s 武僧
```

如果有正常返回结果，就说明插件已经能用了。

## 一键跳到 NapCat WebUI 安装页

如果你的 NapCat 版本是 `4.15.19` 或更高，可以直接点下面按钮跳到插件安装界面：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-ff14-logs" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 已知限制

- 插件依赖 FFLogs 页面数据和当前解析方式，上游改版后可能需要更新
- 仓库内字典是静态资源，遇到新版本内容变动时可能需要同步更新

## License

MIT
