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

## 08:55 万物的一天 · 第一期《一杯奶茶的一天》
- 用户：总主题定为“万物的一天”，同意先做“一杯奶茶的一天”样例；明确不要“教育人”的语气。
- 做法：奶茶第一人称日记体，三章（清晨：各自醒来 / 中午：被点名 / 下午：出门见你），共 16 步；底部表格改为“奶茶日记”（在哪 / 我是 / 几点 / 温度 / 小事）；数据页叫“小账本”，只放轻松的小数字。
- 引擎新增 `labels` 配置：把“正在学习 / 学习进度 / 步骤详情 / 概览 / 开始第 1 步”改成课程自己的说法（奶茶用“正在发生 / 这一天走到 / 这一刻 / 开头 / 从这里开始”）。同步到热管理站 engine/app.js。
- 自测：milk-tea.html 三章 + 小账本、flowstep 示例、热管理站，均无报错。
- 文件：`milk-tea.html`、`content/milk-tea-day/`、`docs/preview-milk-tea.png`。
