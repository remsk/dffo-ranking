<template>
  <div class="character">
    <h2 class="header">{{ character.name }}</h2>
    <router-link v-if="character.name !== previousCharacter[1]" class="previous" :to="{ name: 'character', params: { slug: previousCharacter[0] }}">{{ previousCharacter[1] }}</router-link>
    <div class="status">
      <div class="avatar" :style="{ backgroundImage: 'url(' + fetchCard(character.name) + ')'}"></div>
      <div class="stats">
        <span class="icon" :style="{ backgroundImage: 'url(' + fetchIcon('artifact', 'gear') + ')'}"></span>
        <span class="icon" :style="{ backgroundImage: 'url(' + fetchIcon('armor', 'gear') + ')'}"></span>
        <span class="icon" :style="{ backgroundImage: 'url(' + fetchIcon(weaponType, 'gear') + ')'}"></span>
      </div>
      <div class="chart">
        <pattern-chart :width="240" :height="200" :data="patternData" />
      </div>
    </div>
    <router-link v-if="character.name !== nextCharacter[1]" class="next" :to="{ name: 'character', params: { slug: nextCharacter[0] }}">{{ nextCharacter[1] }}</router-link>
  </div>
</template>

<script>
import Toolkit from '../mixins/toolkit'
import PatternChart from './PatternChart'

export default {
  name: 'Character',
  mixins: [Toolkit],
  data () {
    return {
      character: {},
      patterns: [],
      weapons: [],
      patternData: []
    }
  },
  methods: {
    loadCharacter: function () {
      return this.fetchCharacters()
      .find(function (a) { return this.slugify(a.name) === this.$route.params.slug }, this)
    },
    removeAwakeningStats: function (prop) {
      let baseStat = this.character.base[prop]
      switch (prop) {
        case 'iBRV':
          return baseStat
        case 'mBRV':
          baseStat -= parseInt(Math.ceil(this.character.awakeningPassives[prop] / 2) * 9)
          return baseStat
        case 'HP':
          baseStat -= parseInt(((this.character.awakeningPassives[prop] + 100) / 2) * 10)
          return baseStat
        default:
          baseStat -= parseInt(Math.ceil(this.character.awakeningPassives[prop] / 2) * 10)
          return baseStat
      }
    },
    getPatternData: function () {
      if (this.character.placeholder !== true) {
        let trueBaseStats = [this.character.full.HP, this.character.full.iBRV, this.character.full.mBRV, this.character.full.ATK, this.character.full.DEF]
        let hpPattern = this.patterns.find(function (p) { return p.hp === trueBaseStats[0] }, trueBaseStats).type
        let ibrvPattern = this.patterns.find(function (p) { return p.ibrv === trueBaseStats[1] }, trueBaseStats).type
        let mbrvPattern = this.patterns.find(function (p) { return p.mbrv === trueBaseStats[2] }, trueBaseStats).type
        let atkPattern = this.patterns.find(function (p) { return p.atk === trueBaseStats[3] }, trueBaseStats).type
        let defPattern = this.patterns.find(function (p) { return p.def === trueBaseStats[4] }, trueBaseStats).type
        return [[hpPattern, defPattern, mbrvPattern, ibrvPattern, atkPattern],
          [this.character.base.HP, this.character.base.DEF, this.character.base.mBRV, this.character.base.iBRV, this.character.base.ATK]]
      }
      return [0, 0, 0, 0, 0]
    },
    setTrueBaseStats: function () {
      if (this.character.placeholder !== true) {
        this.character.full.HP = this.removeAwakeningStats('HP')
        this.character.full.iBRV = this.removeAwakeningStats('iBRV')
        this.character.full.mBRV = this.removeAwakeningStats('mBRV')
        this.character.full.ATK = this.removeAwakeningStats('ATK')
        this.character.full.DEF = this.removeAwakeningStats('DEF')
      }
      this.patternData = this.getPatternData()
    },
    changeCharacterPage: function (e) {
      if (e.keyCode === 37) {
        this.openCharacterPage(this.previousCharacter[0])
      } else if (e.keyCode === 39) {
        this.openCharacterPage(this.nextCharacter[0])
      }
    }
  },
  created () {
    this.character = this.loadCharacter()
    this.patterns = this.fetchPatterns()
    this.weapons = this.fetchFilters().weapons
    this.setTrueBaseStats()
    document.addEventListener('keydown', this.changeCharacterPage)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.changeCharacterPage)
  },
  computed: {
    previousCharacter: function () {
      let previousId = parseInt(this.character.id) - 1
      if (previousId > 0) {
        let previousName = this.fetchCharacters()
          .sort(function (a, b) { return a.id - b.id })
          .find(function (b) { return b.id === previousId }, previousId).name
        return [this.slugify(previousName), previousName]
      } else {
        return [this.slugify(this.character.name), this.character.name]
      }
    },
    nextCharacter: function () {
      let nextId = parseInt(this.character.id) + 1
      if (nextId <= this.fetchCharacters().length) {
        let nextName = this.fetchCharacters()
          .sort(function (a, b) { return a.id - b.id })
          .find(function (b) { return b.id === nextId }, nextId).name
        return [this.slugify(nextName), nextName]
      } else {
        return [this.slugify(this.character.name), this.character.name]
      }
    },
    weaponType: function () {
      let weaponTypeID = this.character.weaponType
      return this.slugify(this.weapons.find(function (weaponType) { return weaponType.id === weaponTypeID }, weaponTypeID).name)
    }
  },
  watch: {
    '$route.params.slug': function () {
      this.character = this.loadCharacter()
      this.setTrueBaseStats()
    }
  },
  components: {
    PatternChart
  }
}
</script>

<style scoped>

div.character {
  position: relative;
}

div.status {
  margin: 0 auto;
  font-size: 0;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
  padding: 10px;
}

div.chart  {
  color: #212121;
/*  background-color: #bdbdbd;
  border-radius: 3px;
  box-shadow: inset 0 0 10px #273153;*/
/*  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;*/
  display: inline-block;
  vertical-align: top;
  width: 240px;
  height: 200px;
}

div.chart div {
  margin-top: -2.5px;
}

div.stats {
  width: calc(100% - 450px);
  height: 200px;
  display: inline-block;
  vertical-align: top;
}

div.avatar {
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
  display: inline-block;
  border-radius: 3px;
  box-shadow: inset 0 0 10px #273153;
  margin-right: 10px;
  vertical-align: top;
}

span.icon {
  display: block;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
}

a {
  text-decoration: none;
  position: absolute;
  color: #ccc;
  top: -15px;
  font-family: 'Karla', sans-serif;
  text-transform: uppercase;
  font-size: 1.15em;
}

a.previous {
  left: 0;
}

a.next {
  right: 0;
}
</style>
