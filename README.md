# napcat-plugin-ff14-logs

一个为 NapCat 设计的 FF14 Logs 百分位查询插件。适合在群聊里快速查某个 Boss、某个职业的大致表现，不用每次都自己打开网页。

## 适用场景

- 在群聊中快速查询 FF14 Logs 百分位
- 使用常见 Boss 简称和职业名直接查询
- 不想额外准备 API Key

## 环境要求

- 已部署 NapCat，并了解如何导入插件包 (`.zip`)
- 知道要查询的 Boss 名或常见简称，例如 `p9s`
- 知道要查询的职业名，例如 `武僧`

仓库内已附带职业和 Boss 字典，普通使用无需自己准备数据文件。

## 安装步骤

### 1. 下载插件

前往 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-logs/releases) 页面，下载最新版本的 `napcat-plugin-ff14-logs.zip`。

### 2. 导入 NapCat

在 NapCat 的插件管理界面中导入 zip 文件，并启用插件。

### 3. 默认配置

插件首次运行将使用以下默认配置：

```json
{
  "enabled": true,
  "commandPrefix": "/",
  "requestTimeoutMs": 10000,
  "jobDictPath": "./data/job.json",
  "bossDictPath": "./data/boss.json"
}
```

一般只需要按需调整：

- `commandPrefix`
- `requestTimeoutMs`

## 使用方法

基础格式：

```text
/ff14logs boss job
```

示例：

```text
/ff14logs p9s 武僧
/ff14logs p9s 武僧 0 rdps
```

如果你只是第一次上手，先记住前三段就够了：

- `ff14logs`
- `boss`
- `job`

## 验证安装

发送以下命令测试插件是否正常工作：

```text
/ff14logs p9s 武僧
```

若返回正常结果，即表示插件已成功运行。

## 快捷安装链接

NapCat 版本 ≥ `4.15.19` 时，可点击下方按钮快速跳转至插件安装页面：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-ff14-logs" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 已知限制

- 插件依赖 FFLogs 页面数据和当前解析方式，上游改版后可能需要更新
- 仓库内字典是静态资源，遇到新版本内容变动时可能需要同步更新

## License

MIT
