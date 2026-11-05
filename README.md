# FlowStep

把“看不见的、随时间展开的过程”拆成一步一步讲清楚的互动讲解模板。

同一屏对齐三件事：
- **结构**：中间的示意图——东西在哪里、经过哪些部件
- **时间**：左侧步骤 + 播放控制——先发生什么、后发生什么
- **状态**：底部轨迹表——每一站它变成了什么

适合满足三个条件的题材：有一个被追踪的**载体**；载体经过一串**离散站点**，每站发生可描述的变化；变化本身**看不见或太快**。例如热管理、能量流、总线报文、网络协议、调用链、控制策略、审批流程。

## 快速开始
1. 双击 `index.html`，看自带的示例课程“包裹之旅”。
2. 复制 `content/example-parcel/` 为 `content/<你的课程>/`。
3. 改 `course.js`（品牌、分类、载体、表格列），在 `lessons/` 里写课题。
4. 在 `index.html` 里把脚本路径换成你的课程。

纯静态：HTML + CSS + 原生 JS，无构建、无依赖，`file://` 直接打开，也可放到 GitHub Pages。

详细的数据格式见 [docs/GUIDE.md](docs/GUIDE.md)。

## 目录
```
engine/            通用引擎（一般不用改）
  core.js          工具函数与 SVG 片段（管路、部件、阀、泵、箭头…）
  app.js           学习台：顶栏进度、侧栏、步骤详情、轨迹表、播放控制
  engine.css       样式与调色板（浅色 / 深色）
content/
  example-parcel/  示例课程
    course.js      课程配置
    lessons/       每个课题一个文件
index.html         入口：先 core.js → 课程脚本 → 最后 app.js
```

## 使用案例
- **万物的一天 · 第一期《一杯奶茶的一天》**：`milk-tea.html`，奶茶第一人称讲自己从原料到被喝掉的一天（`content/milk-tea-day/`）。
- [汽车空调及热管理讲解](https://github.com/LinkHellc/hermal-management-site)：9 个课题，第一份用 FlowStep 做的完整课程。
