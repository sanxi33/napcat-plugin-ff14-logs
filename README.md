# napcat-plugin-ff14-logs

在群聊里查 FF14 Logs 百分位。敲个 Boss 名加职业名，直接出数据，省得自己开网页查。

## 用法

基本格式就三样：

```text
/ff14logs boss job
```

例子：

```text
/ff14logs p9s 武僧
/ff14logs p9s 武僧 0 rdps
```

前两段是必须的：`ff14logs`、`boss`、`job`。第三段及之后的参数可以调整具体数据范围。

## 安装

去 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-logs/releases) 下载 `napcat-plugin-ff14-logs.zip`，NapCat 插件管理导入启用。

默认配置如下，一般改个命令前缀就够了：

```json
{
  "enabled": true,
  "commandPrefix": "/",
  "requestTimeoutMs": 10000,
  "jobDictPath": "./data/job.json",
  "bossDictPath": "./data/boss.json"
}
```

职业和 Boss 字典已经打包在仓库里了，不需要自己额外准备。

NapCat 版本 ≥ 4.15.19 可以点这个按钮快速跳转到安装页：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-ff14-logs" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 注意事项

数据依赖 FFLogs 的页面解析，上游改版的话需要同步更新插件。仓库里的字典文件在版本大更新后也需要手动同步。

## License

MIT
