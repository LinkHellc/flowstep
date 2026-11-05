/* 万物的一天 · 第一期：一杯奶茶的一天
   语气：奶茶自己讲自己的一天，轻松、像日记，不讲课。 */
TM.config = {
  id: 'milk-tea-day',
  siteTitle: '一杯奶茶的一天 · 万物的一天',
  brand: {
    title: 'A DAY OF THINGS',
    tagline: '万物的一天 · 第一期',
    logo: `<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path d="M9 9 H23 L21 28 H11 Z" fill="none" stroke="var(--blue)" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M8 9 H24" stroke="var(--blue)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M18 9 L21 2" stroke="var(--hot)" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="14" cy="24" r="1.6" fill="var(--text)"/><circle cx="18" cy="24.5" r="1.6" fill="var(--text)"/><circle cx="16" cy="21.5" r="1.6" fill="var(--text)"/>
    </svg>`
  },
  sidebarTitle: '一杯奶茶的一天',
  categories: ['清晨', '中午', '下午'],
  layers: { label: '此刻', items: ['醒来', '出杯', '上路', '到你手里'] },
  tabs: ['此刻', '小账本'],
  labels: { now: '正在发生', progress: '这一天走到', detail: '这一刻', overview: '开头', start: '▶ 从这里开始' },
  table: {
    title: '奶茶日记',
    columns: ['在哪', '我是', '几点', '温度', '小事'],
    empty: '按 <b>▶ 播放</b>，我每到一个地方就写一行日记。'
  },
  media: {
    tea: { name: '茶汤', color: 'var(--warm)' },
    milk: { name: '牛奶', color: 'var(--cool)' },
    pearl: { name: '珍珠', color: 'var(--air)' },
    order: { name: '一张订单', color: 'var(--cold)' },
    cup: { name: '一杯奶茶', color: 'var(--hot)' },
    done: { name: '空杯子', color: 'var(--ok)' }
  }
};
