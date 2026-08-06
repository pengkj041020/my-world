<template>
  <main class="detail-page">
    <button class="back-button" type="button" @click="$emit('back')">← 返回三界总览</button>
    <header class="detail-hero">
      <span class="detail-icon">{{ section.icon }}</span>
      <p>{{ realm.label }} · {{ section.slug.toUpperCase() }}</p>
      <span class="realm-name">{{ realm.name }}</span>
      <h1>{{ section.name }}</h1>
      <div class="title-rule"></div>
      <p class="detail-lead">{{ section.lead }}</p>
    </header>

    <dl v-if="section.stats?.length" class="stats-grid">
      <div v-for="stat in section.stats" :key="stat[0]">
        <dt>{{ stat[0] }}</dt>
        <dd>{{ stat[1] }}</dd>
      </div>
    </dl>

    <section v-if="section.groups?.length" class="content-section">
      <div class="content-heading">
        <span>01</span>
        <div><p>CONTENT FRAMEWORK</p><h2>内容框架</h2></div>
      </div>
      <div class="entry-grid">
        <article v-for="(group, index) in section.groups" :key="group.title">
          <span>0{{ index + 1 }}</span>
          <h3>{{ group.title }}</h3>
          <p>{{ group.text }}</p>
          <ol v-if="group.levels" class="level-list">
            <li v-for="level in group.levels" :key="level.name">
              <strong>{{ level.name }}</strong>
              <span>{{ level.text }}</span>
            </li>
          </ol>
          <aside v-if="group.note" class="level-note">{{ group.note }}</aside>
          <div v-if="group.attributes" class="attribute-list" aria-label="常见灵气属性">
            <span v-for="attribute in group.attributes" :key="attribute">{{ attribute }}</span>
          </div>
          <div v-if="group.schools" class="school-list">
            <section v-for="school in group.schools" :key="school.name" class="school-item">
              <div class="school-meta">
                <strong>{{ school.attribute }}</strong>
                <span>{{ school.region }}</span>
              </div>
              <div>
                <h4>{{ school.name }}</h4>
                <p>{{ school.text }}</p>
              </div>
            </section>
          </div>
          <small>档案待持续补充</small>
        </article>
      </div>
    </section>

    <section v-if="section.relations" class="content-section relation-section">
      <div class="content-heading">
        <span>02</span>
        <div><p>FACTION RELATIONS</p><h2>势力关系图</h2></div>
      </div>
      <svg
        ref="svgRef"
        class="relation-graph"
        viewBox="0 0 900 620"
        role="img"
        aria-label="势力关系图（可拖动节点）"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <!-- 连线（先画，置于节点下层；遇中间节点自动绕行） -->
        <g class="edges">
          <path
            v-for="(edge, i) in relationEdges"
            :key="'e' + i"
            :d="edge.path"
            fill="none"
            :class="['edge', 'edge-' + edge.type]"
          />
        </g>
        <!-- 连线标签 -->
        <g class="edge-labels">
          <text
            v-for="(edge, i) in relationEdges"
            :key="'l' + i"
            :x="edge.mx" :y="edge.my"
            class="edge-label"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ edge.label }}</text>
        </g>
        <!-- 节点（后画，盖住线端；可拖动） -->
        <g class="nodes">
          <g
            v-for="node in localNodes"
            :key="node.id"
            :transform="`translate(${node.x},${node.y})`"
            class="node-group"
            @pointerdown="onNodeDown($event, node)"
          >
            <circle r="42" class="node-circle" />
            <text class="node-text" text-anchor="middle" dominant-baseline="middle">{{ node.name }}</text>
          </g>
        </g>
      </svg>
      <ul class="relation-legend">
        <li><span class="legend-line ally"></span>亲近 / 同源</li>
        <li><span class="legend-line rival"></span>敌对 / 对峙</li>
        <li><span class="legend-line neutral"></span>中立 / 邻接</li>
        <li><span class="legend-line unknown"></span>关系待考</li>
      </ul>
    </section>

    <!-- 人物图鉴：角色卡片列表 / 角色详情 -->
    <section v-if="section.characters?.length" class="content-section character-section">
      <!-- 角色详情视图 -->
      <div
        v-if="selectedCharacter"
        class="character-detail"
        :class="{ 'has-bg': selectedCharacter.bgImage }"
        :style="selectedCharacter.bgImage ? { backgroundImage: `linear-gradient(rgba(12,13,15,.86), rgba(12,13,15,.94)), url(${selectedCharacter.bgImage})` } : null"
      >
        <button class="back-button" type="button" @click="backToCharacterList">← 返回人物列表</button>
        <header class="character-detail-hero">
          <div class="character-portrait">
            <img v-if="selectedCharacter.image" :src="selectedCharacter.image" :alt="selectedCharacter.name" />
            <div v-else class="character-portrait-placeholder">
              <span>人物立绘</span>
              <small>待补充</small>
            </div>
          </div>
          <div class="character-detail-info">
            <span class="character-detail-role">{{ selectedCharacter.role }}</span>
            <h2>{{ selectedCharacter.name }}</h2>
            <p class="character-detail-brief">{{ selectedCharacter.brief }}</p>
          </div>
        </header>
        <dl class="character-detail-list">
          <div v-for="item in selectedCharacter.detail" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.text }}</dd>
          </div>
        </dl>
      </div>
      <!-- 角色卡片列表 -->
      <div v-else>
        <div class="content-heading">
          <span>02</span>
          <div><p>CHARACTER ARCHIVE</p><h2>角色名册</h2></div>
        </div>
        <div class="character-grid">
          <article
            v-for="character in section.characters"
            :key="character.id"
            class="character-card"
            tabindex="0"
            @click="selectCharacter(character.id)"
            @keydown.enter="selectCharacter(character.id)"
          >
            <span class="character-card-role">{{ character.role }}</span>
            <h3>{{ character.name }}</h3>
            <p>{{ character.brief }}</p>
            <span class="character-card-arrow" aria-hidden="true">→</span>
          </article>
        </div>
      </div>
    </section>

    <section class="placeholder-section">
      <p>后续扩展</p>
      <h2>可继续添加图鉴、时间线与关联条目</h2>
      <span>该区域已预留为详细资料、图片及交叉链接的展示位置。</span>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ section: { type: Object, required: true }, realm: { type: Object, required: true } })
defineEmits(['back'])

const svgRef = ref(null)
const draggingId = ref(null)
// props 只读，用本地响应式副本驱动拖拽
const localNodes = ref(
  props.section.relations
    ? props.section.relations.nodes.map((n) => ({ ...n }))
    : []
)

// 人物图鉴：选中的角色 id（null 显示列表，非空显示详情）
const selectedCharacterId = ref(null)
const selectedCharacter = computed(() =>
  props.section.characters?.find((c) => c.id === selectedCharacterId.value) || null
)
const selectCharacter = (id) => { selectedCharacterId.value = id; window.scrollTo({ top: 0, behavior: 'smooth' }) }
const backToCharacterList = () => { selectedCharacterId.value = null; window.scrollTo({ top: 0, behavior: 'smooth' }) }

// 圆半径（与 .node-circle 的 r="42" 保持一致）
const NODE_R = 42

// 点到线段距离
const distPointToSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(px - x1, py - y1)
  let t = ((px - x1) * dx + (py - y1) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

// 关系图：把 edges 映射为 path 字符串与标签坐标
// - 端点裁剪到圆边缘
// - 若连线穿过中间节点，用二次贝塞尔曲线绕开
const relationEdges = computed(() => {
  const rel = props.section.relations
  if (!rel) return []
  const nodeMap = new Map(localNodes.value.map((n) => [n.id, n]))
  const allNodes = localNodes.value
  return rel.edges
    .map((edge) => {
      const a = nodeMap.get(edge.from)
      const b = nodeMap.get(edge.to)
      if (!a || !b) return null
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const ux = dx / len
      const uy = dy / len
      // 端点裁剪到圆边缘
      const x1 = a.x + ux * NODE_R
      const y1 = a.y + uy * NODE_R
      const x2 = b.x - ux * NODE_R
      const y2 = b.y - uy * NODE_R
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      // 检测中间是否有其他节点阻挡
      const blocker = allNodes.find(
        (n) => n.id !== a.id && n.id !== b.id && distPointToSegment(n.x, n.y, a.x, a.y, b.x, b.y) < NODE_R + 10
      )
      let path = `M ${x1} ${y1} L ${x2} ${y2}`
      let lx = mx
      let ly = my
      if (blocker) {
        // 垂直于连线的两个候选方向，选离 blocker 更远的一侧
        const nx = -uy
        const ny = ux
        const off = NODE_R + 28
        const c1x = mx + nx * off
        const c1y = my + ny * off
        const c2x = mx - nx * off
        const c2y = my - ny * off
        const useFirst = Math.hypot(c1x - blocker.x, c1y - blocker.y) > Math.hypot(c2x - blocker.x, c2y - blocker.y)
        const cx = useFirst ? c1x : c2x
        const cy = useFirst ? c1y : c2y
        path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
        // 贝塞尔曲线 t=0.5 处作为标签位置：0.25*P0 + 0.5*P1 + 0.25*P2
        lx = 0.25 * x1 + 0.5 * cx + 0.25 * x2
        ly = 0.25 * y1 + 0.5 * cy + 0.25 * y2
      }
      return { ...edge, path, mx: lx, my: ly }
    })
    .filter(Boolean)
})

// 屏幕坐标 → SVG viewBox 坐标
const toSvgPoint = (clientX, clientY) => {
  const svg = svgRef.value
  if (!svg || !svg.getScreenCTM) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: p.x, y: p.y }
}

const onNodeDown = (e, node) => {
  draggingId.value = node.id
  svgRef.value?.setPointerCapture(e.pointerId)
  e.preventDefault()
}

const onPointerMove = (e) => {
  if (!draggingId.value) return
  const { x, y } = toSvgPoint(e.clientX, e.clientY)
  const node = localNodes.value.find((n) => n.id === draggingId.value)
  if (node) {
    node.x = Math.round(x)
    node.y = Math.round(y)
  }
}

const onPointerUp = (e) => {
  if (draggingId.value && svgRef.value?.hasPointerCapture(e.pointerId)) {
    svgRef.value.releasePointerCapture(e.pointerId)
  }
  draggingId.value = null
}
</script>

<style scoped>
.detail-page { max-width: 1120px; min-height: calc(100vh - 70px); margin: 0 auto; padding: 42px 24px 90px; }
.back-button { padding: 9px 0; color: #b7b2aa; background: none; border: 0; cursor: pointer; font-size: 14px; }
.back-button:hover { color: #e6c98f; }
.detail-hero { max-width: 790px; padding: 90px 0 74px; }
.detail-icon { display: block; color: #d4ad70; font-size: 36px; margin-bottom: 30px; }
.realm-name { display: inline-block; margin-top: 18px; padding: 6px 12px; color: #d9b879; background: rgba(164,126,72,.1); border: 1px solid #4d412f; border-radius: 999px; font-size: 12px; letter-spacing: .12em; }
.detail-hero > p:first-of-type, .content-heading p { margin: 0; color: #ad8954; font-size: 11px; font-weight: 700; letter-spacing: .22em; }
h1 { margin: 16px 0; color: #fffaf0; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; font-size: clamp(48px, 7vw, 76px); letter-spacing: .08em; }
.title-rule { width: 64px; height: 2px; margin: 28px 0; background: #a47e48; }
.detail-lead { color: #c9c4bb; font-size: 18px; line-height: 2; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0; border-block: 1px solid #2c2e32; }
.stats-grid div { padding: 25px 20px; border-right: 1px solid #2c2e32; }
.stats-grid div:last-child { border: 0; }
dt { color: #817d76; font-size: 12px; margin-bottom: 8px; }
dd { margin: 0; color: #e9e3da; font-size: 16px; }
.content-section { padding: 90px 0; }
.content-heading { display: flex; gap: 20px; margin-bottom: 38px; }
.content-heading > span { padding-top: 4px; color: #786344; font: 13px ui-monospace, monospace; }
.content-heading h2, .placeholder-section h2 { margin: 7px 0 0; color: #f2ede4; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; font-size: 30px; }
.entry-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.entry-grid article { padding: 30px; background: #141619; border: 1px solid #2b2e32; border-radius: 8px; }
.entry-grid article > span { color: #8f7045; font: 12px ui-monospace, monospace; }
.entry-grid h3 { margin: 20px 0 10px; color: #eee9e0; font-size: 19px; }
.entry-grid p { min-height: 54px; margin: 0 0 22px; color: #aaa69f; font-size: 14px; line-height: 1.8; }
.entry-grid article:has(.level-list), .entry-grid article:has(.school-list) { grid-column: 1 / -1; }
.level-list { display: grid; gap: 0; margin: 6px 0 24px; padding: 0; list-style: none; border-top: 1px solid #303236; }
.level-list li { display: grid; grid-template-columns: 72px 1fr; gap: 18px; padding: 18px 4px; border-bottom: 1px solid #292b2e; }
.level-list strong { color: #dfbd80; font-size: 14px; }
.level-list span { color: #bbb6ae; font-size: 14px; line-height: 1.8; }
.level-note { margin: 0 0 24px; padding: 16px 18px; color: #d5c8b3; background: rgba(164,126,72,.1); border-left: 2px solid #a47e48; font-size: 14px; line-height: 1.8; }
.attribute-list { display: flex; flex-wrap: wrap; gap: 9px; margin: 4px 0 30px; }
.attribute-list span { min-width: 56px; padding: 8px 14px; color: #e1c38c; background: #1c1b18; border: 1px solid #4d412f; border-radius: 999px; font-size: 13px; text-align: center; }
.school-list { margin-bottom: 25px; border-top: 1px solid #303236; }
.school-item { display: grid; grid-template-columns: 160px 1fr; gap: 26px; padding: 25px 4px; border-bottom: 1px solid #292b2e; }
.school-meta { display: flex; flex-direction: column; gap: 8px; }
.school-meta strong { color: #dfbd80; font-size: 15px; }
.school-meta span { color: #7f7b74; font-size: 12px; line-height: 1.6; }
.school-item h4 { margin: 0 0 10px; color: #eee9e0; font-size: 17px; }
.school-item p { min-height: auto; margin: 0; color: #aaa69f; font-size: 14px; line-height: 1.9; }
.entry-grid small { color: #706d68; }
.placeholder-section { padding: 46px; text-align: center; background: linear-gradient(135deg, #17191c, #111316); border: 1px dashed #51442f; border-radius: 8px; }
.placeholder-section > p { color: #ac8953; font-size: 12px; letter-spacing: .2em; }
.placeholder-section span { display: block; margin-top: 16px; color: #8e8a83; font-size: 14px; }

/* 关系图 */
.relation-section { padding-top: 0; }
.relation-graph { display: block; width: 100%; max-width: 720px; margin: 0 auto; overflow: visible; user-select: none; touch-action: none; }
.node-group { cursor: grab; }
.node-group:active { cursor: grabbing; }
.node-circle { fill: #141619; stroke: #806942; stroke-width: 1.5; }
.node-text { fill: #f0ece5; font-size: 13px; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; }
.edge { stroke-width: 1.5; }
.edge-ally { stroke: #7fb069; }
.edge-rival { stroke: #c45a5a; }
.edge-neutral { stroke: #8a857c; }
.edge-unknown { stroke: #8a857c; stroke-dasharray: 5 4; }
.edge-label { fill: #cbc6bd; font-size: 11px; paint-order: stroke; stroke: #0c0d0f; stroke-width: 4; stroke-linejoin: round; }
.relation-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 28px 0 0; padding: 0; list-style: none; }
.relation-legend li { display: flex; align-items: center; gap: 8px; color: #9f9c96; font-size: 13px; }
.legend-line { display: inline-block; width: 26px; height: 0; border-top: 2px solid #8a857c; }
.legend-line.ally { border-color: #7fb069; }
.legend-line.rival { border-color: #c45a5a; }
.legend-line.neutral { border-color: #8a857c; }
.legend-line.unknown { border-top-style: dashed; border-color: #8a857c; }

/* 人物图鉴 */
.character-section { padding-top: 0; }
.character-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.character-card { position: relative; min-height: 150px; padding: 26px; background: #141619; border: 1px solid #2b2e32; border-radius: 8px; cursor: pointer; transition: transform .2s, border-color .2s, background .2s; }
.character-card:hover, .character-card:focus-visible { transform: translateY(-4px); border-color: #806942; background: #181a1d; outline: none; }
.character-card-role { display: block; margin-bottom: 14px; color: #9f7c4c; font-size: 11px; font-weight: 700; letter-spacing: .18em; }
.character-card h3 { margin: 0 0 10px; color: #f0ece5; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; font-size: 20px; letter-spacing: .06em; }
.character-card p { margin: 0; color: #9f9c96; font-size: 14px; line-height: 1.7; }
.character-card-arrow { position: absolute; right: 22px; top: 24px; color: #6f624e; font-size: 18px; }
.character-detail { padding: 20px 0 0; }
.character-detail.has-bg { margin-top: 16px; padding: 32px; border-radius: 12px; background-color: #0c0d0f; background-size: cover; background-position: center; background-repeat: no-repeat; }
.character-detail-hero { display: grid; grid-template-columns: 220px 1fr; gap: 36px; align-items: start; padding: 30px 0 36px; border-bottom: 1px solid #2c2e32; }
.character-portrait { width: 220px; height: 260px; background: #141619; border: 1px dashed #51442f; border-radius: 8px; overflow: hidden; }
.character-portrait img { display: block; width: 100%; height: 100%; object-fit: cover; }
.character-portrait-placeholder { display: grid; place-content: center; gap: 8px; width: 100%; height: 100%; text-align: center; }
.character-portrait-placeholder span { color: #6f624e; font-size: 13px; letter-spacing: .2em; }
.character-portrait-placeholder small { color: #4a4540; font-size: 11px; }
.character-detail-info { padding-top: 8px; }
.character-detail-role { display: inline-block; margin-bottom: 16px; padding: 6px 12px; color: #d9b879; background: rgba(164,126,72,.1); border: 1px solid #4d412f; border-radius: 999px; font-size: 12px; letter-spacing: .12em; }
.character-detail-hero h2 { margin: 0 0 18px; color: #fffaf0; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; font-size: clamp(40px, 6vw, 60px); letter-spacing: .08em; }
.character-detail-brief { margin: 0; color: #c9c4bb; font-size: 17px; line-height: 1.9; }
.character-detail-list { display: grid; grid-template-columns: 1fr; gap: 0; margin: 36px 0 0; }
.character-detail-list > div { display: grid; grid-template-columns: 100px 1fr; gap: 24px; padding: 24px 4px; border-bottom: 1px solid #25272a; }
.character-detail-list dt { color: #9f7c4c; font-size: 13px; font-weight: 700; letter-spacing: .14em; }
.character-detail-list dd { margin: 0; color: #cbc6bd; font-size: 15px; line-height: 1.9; }

@media (max-width: 700px) { .detail-page { padding-inline: 20px; } .detail-hero { padding: 65px 0 54px; } .stats-grid, .entry-grid { grid-template-columns: 1fr; } .stats-grid div { border-right: 0; border-bottom: 1px solid #2c2e32; } .level-list li, .school-item { grid-template-columns: 1fr; gap: 10px; } .placeholder-section { padding: 35px 22px; } .character-grid { grid-template-columns: 1fr; } .character-detail-hero { grid-template-columns: 1fr; justify-items: center; text-align: center; } .character-detail-list > div { grid-template-columns: 1fr; gap: 8px; } }
</style>
