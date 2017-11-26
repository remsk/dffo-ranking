<template>
  <div class="character">
    <h2 class="header">{{ character.name }}</h2>
    <router-link class="previous" :to="{ name: 'character', params: { slug: previousCharacter }}">Previous</router-link>
    <div class="status">
      <div class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></div>
      <div class="stats">
        <pattern-chart :width="180" :height="180" :data="patternData" />
      </div>
    </div>
    <router-link class="next" :to="{ name: 'character', params: { slug: nextCharacter }}">Next</router-link>
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
      patternData: [0, 0, 0, 0, 0]
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
        return [hpPattern, ibrvPattern, mbrvPattern, atkPattern, defPattern]
      }
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
        this.openCharacterPage(this.previousCharacter)
      } else if (e.keyCode === 39) {
        this.openCharacterPage(this.nextCharacter)
      }
    }
  },
  created () {
    this.character = this.loadCharacter()
    this.patterns = this.fetchPatterns()
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
        return this.slugify(this.fetchCharacters()
          .sort(function (a, b) { return a.id - b.id })
          .find(function (b) { return b.id === previousId }, previousId).name)
      } else {
        return this.slugify(this.character.name)
      }
    },
    nextCharacter: function () {
      let nextId = parseInt(this.character.id) + 1
      if (nextId <= this.fetchCharacters().length) {
        return this.slugify(this.fetchCharacters()
          .sort(function (a, b) { return a.id - b.id })
          .find(function (b) { return b.id === nextId }, nextId).name)
      } else {
        return this.slugify(this.character.name)
      }
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
  max-width: 400px;
  font-size: 0;
  text-align: center;
}

div.stats  {
  margin: 0;
  color: #ccc;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
  display: inline-block;
  width: 180px;
  height: 180px;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
  padding: 10px;
}

div.icon {
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0;
  width: 180px;
  height: 180px;
  display: inline-block;
  border-radius: 3px;
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  box-shadow: inset 0 0 10px #273153;
  padding: 10px;
}

a {
  text-decoration: none;
  position: absolute;
  color: #ccc;
  top: 0;
}

a.previous {
  left: 0;
}

a.next {
  right: 0;
}
</style>
