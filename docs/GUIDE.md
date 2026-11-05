# FlowStep 数据格式与新建课程指南

## 1. 加载顺序
`index.html` 必须按这个顺序引入脚本：

```html
<script src="engine/core.js"></script>          <!-- 1. 提供 TM 工具 -->
<script src="content/<课程>/course.js"></script>  <!-- 2. 设置 TM.config -->
<script src="content/<课程>/lessons/01-xxx.js"></script>  <!-- 3. TM.register 课题，按顺序 -->
<script src="engine/app.js"></script>            <!-- 4. 最后启动界面 -->
```

## 2. 课程配置 `TM.config`

| 字段 | 说明 | 例 |
|---|---|---|
| `id` | 课程标识，用于在浏览器里分开保存学习进度 | `'car-thermal'` |
| `siteTitle` | 浏览器标签页标题 | |
| `brand.title / tagline / logo` | 左上角品牌名、副标题、logo（SVG 字符串） | |
| `sidebarTitle` | 侧栏标题 | `'汽车热管理'` |
| `categories` | 侧栏筛选分类（“全部”自动加在最前） | `['基础','空调']` |
| `layers` | 可选。顶栏的层级条，`{label, items}`；课题用 `layer: 1..n` 指向它 | `{label:'热管理域', items:['整车','座舱']}` |
| `tabs` | 中栏两个标签的名字 | `['回路','数据']` |
| `table.title / columns / empty` | 底部轨迹表的标题、列名、空状态提示 | 见下 |
| `media` | 被追踪的载体状态：`{键: {name, color}}` | `hot: {name:'高压气态冷媒', color:'var(--hot)'}` |

可用颜色变量：`--hot --warm --cold --cool --ok --air --bad --blue --faint`，浅色和深色主题会自动切换。

## 3. 课题 `TM.register({...})`

```js
TM.register({
  id: 'ac-cycle',            // 唯一，出现在网址 #/ac-cycle/3
  code: 'A/C',               // 侧栏上的英文代号
  name: '空调制冷循环',
  cat: '空调',               // 必须是 categories 之一
  layer: 3,                  // 可选，对应 layers.items 的序号（从 1 开始）
  tag: '概览时右上角的标签',
  intro: { s: '副标题', b: '概览正文（可含 HTML）', kv: [['键','值']] },
  svg: () => TM.svg(`...`),  // 中栏示意图，见第 4 节
  steps: [ /* 见下 */ ],
  data: { html: () => '...', mount: (el) => {} },  // 可选：第二个标签页
  mount: (loopEl) => {},                           // 可选：示意图插入后调用
  onStep: (i, loopEl) => {}                        // 可选：每次切换步骤后调用（i = -1 为概览）
});
```

### 步骤字段

| 字段 | 说明 |
|---|---|
| `t` | 标题 |
| `s` | 副标题 |
| `b` | 正文（HTML） |
| `kv` | 右栏键值表 `[['键','值'], ...]` |
| `tag` | 中栏右上角的状态标签 |
| `on` | 本步高亮的部件 id 数组；`'all'` 表示全部 |
| `row` | 可选：轨迹表新增的一行，`[第1列, media 键, 第3列, …]`。第 2 列填 media 的键，界面会显示它的名称和颜色；最后一列按长文本换行 |

`row` 的长度应等于 `table.columns` 的长度。

## 4. 画示意图
`TM.svg(inner, viewBox)` 包一层 `<svg class="dg">`，里面用这些片段拼：

| 片段 | 作用 |
|---|---|
| `TM.box(id, x, y, w, h, 标题, 副标题, {inner, rx, boxCls})` | 部件方框 |
| `TM.pipe(id, d, 颜色键, {noflow})` | 带流动动画的管路，`d` 为 SVG 路径 |
| `TM.valve(id, cx, cy, 标签, 竖向?, 副标签)` | 阀 |
| `TM.pump(id, cx, cy, 标签)` | 泵 |
| `TM.compressor(id, cx, cy, r, 标签)` | 压缩机 |
| `TM.airs(id, [路径...], 颜色键)` | 一组虚线箭头 |
| `TM.point(文字, x, y, id)` | 圆形编号点 |
| `TM.fins(x, y, w, h)` | 换热器翅片纹理 |

每个片段的 `id` 就是步骤 `on` 里引用的名字：不在 `on` 里的部件会变淡，在里面的高亮，管路动画只在高亮时播放。也可以直接写任意 SVG，给元素加 `class="part" data-part="id"` 就能参与高亮。

其他工具：`TM.bar(标签, 百分比, 数值文字, 颜色)` 画横向条形，`TM.segc(el, cb)` 做分段按钮，`TM.lerp(表, x)` 线性插值，`TM.clamp`。

## 5. 新建一门课程的步骤
1. 复制 `content/example-parcel/` → `content/my-course/`。
2. 改 `course.js`：`id`、品牌、分类、`media`（你的载体有哪些状态）、`table.columns`（每一站要记录什么）。
3. 先在纸上列出：**载体**是什么、经过哪些**站点**、每站**状态**怎么变。每一站就是一个步骤。
4. 为每个课题写一个 `lessons/NN-xxx.js`：先画 `svg`，给部件起 id，再写 `steps`。
5. 在 `index.html` 里换成你的脚本路径，双击打开检查。

## 6. 快捷键
`←` `→` 上一步 / 下一步，`空格` 播放 / 暂停。网址 `#/<课题id>/<步骤号>` 可直接分享到某一步。
