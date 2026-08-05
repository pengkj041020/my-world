<template>
  <div class="app-shell">
    <header class="navbar">
      <a class="brand" href="#/" @click="showHome">三界</a>
      <nav v-if="!activeSection" class="nav-links" aria-label="主导航">
        <a href="#top">首页</a><a href="#world">世界</a><a href="#explore">设定</a><a href="#updates">日志</a>
      </nav>
      <span v-else class="archive-label">{{ activeRealm.name }} · 世界档案</span>
    </header>

    <WorldDetail v-if="activeSection" :section="activeSection" :realm="activeRealm" @back="goHome" />

    <main v-else id="top">
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">原创世界观设定集</span>
          <h1>三界</h1>
          <p class="slogan">真实界 · 引渡界 · 灵界</p>
          <p class="hero-description">分久必合，合久必分。又一次大年将至末尾……</p>
          <a class="hero-action" href="#world">开始探索</a>
        </div>
      </section>

      <section id="world" class="section intro-section">
        <div class="section-heading"><span class="section-index">01</span><div><p class="section-label">WORLD OVERVIEW</p><h2>世界总览</h2></div></div>
        <p class="intro-text">引渡界。在白狼宗覆灭分裂之后，又过去了五百年。千炼塔、“烬土”组织、九丈原、木柘、寒山部落等派系宗族各据一方，而原本白狼宗的核心地带白泽域，也兴起了一股神秘势力——乾坤殿。它们之间会碰撞出怎样的火花？白狼宗的“余孽”去了哪里？南大陆与东方潜伏宗派又将扮演怎样的角色……</p>
      </section>

      <section id="explore" class="section modules-section">
        <div class="section-heading"><span class="section-index">02</span><div><p class="section-label">EXPLORE</p><h2>探索世界设定</h2></div></div>
        <div class="realm-list">
          <section v-for="(realm, realmIndex) in worldRealms" :key="realm.slug" class="realm-group">
            <header class="realm-heading">
              <span>0{{ realmIndex + 1 }}</span>
              <div><p>{{ realm.label }}</p><h3>{{ realm.name }}</h3><small>{{ realm.desc }}</small></div>
            </header>
            <div class="card-grid">
              <a v-for="item in realm.sections" :key="item.archiveId" class="module-card" :href="`#/${realm.slug}/${item.slug}`" @click="openSection(realm.slug, item.slug)">
                <span class="card-icon" aria-hidden="true">{{ item.icon }}</span>
                <div><h4>{{ item.name }}</h4><p>{{ item.desc }}</p></div>
                <span class="card-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        </div>
      </section>

      <section id="updates" class="section updates-section">
        <div class="section-heading"><span class="section-index">03</span><div><p class="section-label">CHANGELOG</p><h2>设定更新日志</h2></div></div>
        <ul class="update-list"><li v-for="update in updates" :key="update.id"><time :datetime="update.date">{{ update.date }}</time><span>{{ update.msg }}</span></li></ul>
      </section>
    </main>
    <footer>© 2026 三界 · 用想象构建世界</footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import WorldDetail from './components/WorldDetail.vue'
import { updates, worldRealms, worldSections } from './data/worldSections'

const currentRealmSlug = ref('')
const currentSectionSlug = ref('')
const activeRealm = computed(() => worldRealms.find((realm) => realm.slug === currentRealmSlug.value))
const activeSection = computed(() => activeRealm.value?.sections.find((item) => item.slug === currentSectionSlug.value))
const syncRoute = () => {
  const hash = location.hash
  // 非 #/ 开头的 hash 视为原生锚点（如 #world、#explore），不做路由处理
  if (!hash.startsWith('#/')) {
    currentRealmSlug.value = ''
    currentSectionSlug.value = ''
    return
  }
  const [realmSlug, sectionSlug] = hash.slice(2).split('/')
  const realm = worldRealms.find((item) => item.slug === realmSlug)
  if (realm?.sections.some((item) => item.slug === sectionSlug)) {
    currentRealmSlug.value = realmSlug
    currentSectionSlug.value = sectionSlug
    return
  }
  // 兼容改版前的六个详情页地址，原有内容归入引渡界。
  if (worldSections.some((item) => item.slug === realmSlug) && !sectionSlug) {
    location.replace(`#/${worldRealms[1].slug}/${realmSlug}`)
    return
  }
  currentRealmSlug.value = ''
  currentSectionSlug.value = ''
}
const openSection = (realmSlug, sectionSlug) => { currentRealmSlug.value = realmSlug; currentSectionSlug.value = sectionSlug; window.scrollTo({ top: 0, behavior: 'smooth' }) }
const goHome = () => { location.hash = '/'; currentRealmSlug.value = ''; currentSectionSlug.value = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }
const showHome = () => { currentRealmSlug.value = ''; currentSectionSlug.value = '' }
onMounted(() => { syncRoute(); window.addEventListener('hashchange', syncRoute) })
onBeforeUnmount(() => window.removeEventListener('hashchange', syncRoute))
</script>

<style scoped>
.app-shell { min-height: 100vh; color: #ede8df; background: #0c0d0f; }
.navbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; max-width: 1120px; margin: 0 auto; padding: 20px 24px; background: rgba(12,13,15,.9); border-bottom: 1px solid #292b2e; backdrop-filter: blur(12px); }
.brand { color: #f0d29b; font-size: 20px; font-weight: 700; letter-spacing: .12em; text-decoration: none; }
.archive-label { color: #817d76; font-size: 12px; letter-spacing: .18em; }
.nav-links { display: flex; gap: 30px; }.nav-links a { color: #bbb7af; font-size: 14px; text-decoration: none; }.nav-links a:hover { color: #f0d29b; }
main { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.hero { min-height: 620px; display: grid; place-items: center; text-align: center; background: radial-gradient(circle at 50% 36%,rgba(159,105,48,.2),transparent 42%),linear-gradient(180deg,#111316,#0c0d0f); border-bottom: 1px solid #292b2e; }
.hero-content { max-width: 760px; padding: 96px 20px; }.eyebrow,.section-label { color: #bd965e; font-size: 12px; font-weight: 700; letter-spacing: .24em; }
h1 { margin: 20px 0 14px; color: #fffaf0; font-family: "Noto Serif SC","Songti SC",SimSun,serif; font-size: clamp(54px,9vw,92px); line-height: 1.1; letter-spacing: .12em; }
.slogan { color: #e2c48e; font: clamp(22px,3vw,30px) "Noto Serif SC","Songti SC",serif; letter-spacing: .14em; }.hero-description { margin: 24px auto 0; color: #aaa69f; font-size: 17px; line-height: 1.9; }
.hero-action { display: inline-block; margin-top: 38px; padding: 12px 26px; color: #17130e; background: #dfbd80; border-radius: 4px; font-size: 14px; font-weight: 700; text-decoration: none; }
.section { padding: 88px 0; border-bottom: 1px solid #292b2e; scroll-margin-top: 70px; }.section-heading { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 40px; }.section-index { padding-top: 5px; color: #786344; font: 13px ui-monospace,monospace; }.section-label { margin: 0 0 8px; }
h2 { margin: 0; color: #f3eee5; font: 32px/1.3 "Noto Serif SC","Songti SC",SimSun,serif; letter-spacing: .08em; }.intro-text { max-width: 850px; margin: 0 auto; color: #cbc6bd; font-size: 17px; line-height: 2.05; text-align: justify; }
.realm-list { display: grid; gap: 72px; }.realm-group { scroll-margin-top: 86px; }.realm-heading { display: grid; grid-template-columns: 42px 1fr; gap: 16px; margin-bottom: 25px; padding-bottom: 22px; border-bottom: 1px solid #2f3135; }.realm-heading > span { padding-top: 7px; color: #786344; font: 13px ui-monospace,monospace; }.realm-heading p { margin: 0 0 7px; color: #9f7c4c; font-size: 10px; font-weight: 700; letter-spacing: .2em; }.realm-heading h3 { margin: 0 0 9px; color: #f3eee5; font: 27px/1.3 "Noto Serif SC","Songti SC",SimSun,serif; letter-spacing: .1em; }.realm-heading small { color: #8f8b84; font-size: 14px; line-height: 1.7; }.card-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }.module-card { position: relative; min-height: 166px; padding: 26px; color: inherit; background: #141619; border: 1px solid #2b2e32; border-radius: 8px; text-decoration: none; transition: transform .2s,border-color .2s,background .2s; }.module-card:hover { transform: translateY(-4px); border-color: #806942; background: #181a1d; }.card-icon { display: block; margin-bottom: 24px; color: #d4ad70; font-size: 24px; }.module-card h4 { margin: 0 0 10px; color: #f0ece5; font-size: 18px; }.module-card p { margin: 0; color: #9f9c96; font-size: 14px; line-height: 1.7; }.card-arrow { position: absolute; right: 22px; top: 24px; color: #6f624e; font-size: 18px; }
.update-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid #303236; }.update-list li { display: grid; grid-template-columns: 130px 1fr; gap: 22px; padding: 20px 4px; color: #cbc6bd; border-bottom: 1px solid #25272a; font-size: 15px; line-height: 1.6; }.update-list time { color: #aa8b5d; font-family: ui-monospace,monospace; }
footer { max-width: 1120px; margin: 0 auto; padding: 34px 24px; color: #77746f; font-size: 13px; text-align: center; }
@media (max-width:760px) { .navbar { padding:17px 20px; }.nav-links { gap:16px; }.nav-links a:nth-child(2) { display:none; } main { padding:0 20px; }.hero { min-height:520px; }.hero-content { padding:72px 0; }.section { padding:64px 0; }.card-grid { grid-template-columns:1fr; }.module-card { min-height:auto; }.update-list li { grid-template-columns:1fr; gap:5px; } }
</style>
