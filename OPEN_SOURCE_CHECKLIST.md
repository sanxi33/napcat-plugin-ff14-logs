# FF14 Logs Open Source Checklist

## 1. 数据边界

- 不提交现网配置
- 不提交旧工程绝对路径
- 不提交缓存或临时文件

## 2. 可运行性

- 仓库内自带 `data/job.json`
- 仓库内自带 `data/boss.json`
- 默认配置使用相对路径

## 3. 文档

- README 写明命令格式
- README 标明 FFLogs 页面解析依赖
- README 标明静态字典文件来源

## 4. 发布

- Release zip 包含 `index.mjs`、`package.json`、`data/job.json`、`data/boss.json`
- 配置 `INDEX_PAT`
- 确认官方索引 PR 已创建
