/* 示例课程配置：一个快递包裹的旅程
   用来演示“换一份数据就能讲另一个领域”。复制这个文件夹即可开始新课程。 */
TM.config = {
  id: 'example-parcel',
  siteTitle: '包裹之旅 · 模板示例',
  brand: {
    title: 'PARCEL EXPLORER',
    tagline: '模板示例：一个包裹的旅程',
    logo: `<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path d="M16 4 L28 10 V22 L16 28 L4 22 V10 Z M4 10 L16 16 L28 10 M16 16 V28" fill="none" stroke="var(--blue)" stroke-width="2.2" stroke-linejoin="round"/>
    </svg>`
  },
  sidebarTitle: '物流示例',
  categories: ['示例'],
  layers: { label: '环节', items: ['揽收', '分拣', '运输', '派送'] },
  tabs: ['路线', '数据'],
  table: {
    title: '包裹轨迹',
    columns: ['站点', '状态', '时间', '重量', '说明'],
    empty: '按 <b>▶ 播放</b> 开始，包裹每到一站就会新增一条轨迹记录。'
  },
  media: {
    warm: { name: '已揽收', color: 'var(--warm)' },
    cold: { name: '运输中', color: 'var(--cold)' },
    air: { name: '分拣中', color: 'var(--air)' },
    ok: { name: '已签收', color: 'var(--ok)' }
  }
};
