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

    <section class="placeholder-section">
      <p>后续扩展</p>
      <h2>可继续添加图鉴、时间线与关联条目</h2>
      <span>该区域已预留为详细资料、图片及交叉链接的展示位置。</span>
    </section>
  </main>
</template>

<script setup>
defineProps({ section: { type: Object, required: true }, realm: { type: Object, required: true } })
defineEmits(['back'])
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
@media (max-width: 700px) { .detail-page { padding-inline: 20px; } .detail-hero { padding: 65px 0 54px; } .stats-grid, .entry-grid { grid-template-columns: 1fr; } .stats-grid div { border-right: 0; border-bottom: 1px solid #2c2e32; } .level-list li, .school-item { grid-template-columns: 1fr; gap: 10px; } .placeholder-section { padding: 35px 22px; } }
</style>
