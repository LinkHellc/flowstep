# 2026-11-05 FlowStep 模板 run log

## 目标与验收
- 目标：把“汽车空调及热管理讲解网站”的界面抽成通用模板，换一份数据即可讲另一个领域。
- 验收：引擎无领域文字；所有领域内容在 `TM.config` + 课题文件；自带可运行示例；有数据格式说明。

## 用户原话
- 08:38「好做成可复用的模板」
- 08:38「这种模板单独一个github，想一个合适的名称」→ 08:39 建好 https://github.com/LinkHellc/flowstep

## 关键操作
- 从热管理站拆出 `engine/`（core.js / app.js / engine.css），配置项：brand、sidebarTitle、categories、layers、tabs、table（title/columns/empty）、media。
- 示例课程 `content/example-parcel`（包裹之旅，5 步）。
- Playwright 自测示例与热管理两份课程，无报错。

## 下一步
- 推送到 GitHub；热管理站以本仓库为上游同步 engine/。
