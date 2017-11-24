export default {
  data () {
    return {
      minMaxValues: {}
    }
  },
  methods: {
    fullStat: function (prop, index) {
      let fullStat = this.getBaseSynergyValue(prop, index)

      // MAIN BLOCK WHERE TOTAL STAT GETS CALCULATED (BASE + GEAR)
      if (!this.params.baseOnly) {
        if (this.characters[index].exclusiveWeapon !== undefined && this.params.addWeapon) {
          fullStat += this.getGearSynergyValue(prop, 'exclusiveWeapon', index)
          fullStat += parseInt(this.characters[index].exclusiveWeapon.stats[prop] / 5)
        } else if (this.characters[index].baseWeapon !== undefined && this.params.addWeapon) {
          fullStat += this.getGearSynergyValue(prop, 'baseWeapon', index)
          fullStat += parseInt(this.characters[index].baseWeapon.stats[prop] / 5)
        }
        if (this.characters[index].armor !== undefined && this.params.addArmor) {
          fullStat += this.getGearSynergyValue(prop, 'armor', index)
          fullStat += parseInt(this.characters[index].armor.stats[prop] / 5)
          if (this.characters[index].armor.bonus[prop] !== undefined) {
            fullStat += this.characters[index].armor.bonus[prop]
          }
        }

        // SKIP IF NOT ATK (removed)
        // if (this.params.ATKOnly && prop !== 'ATK') {
        //   return fullStat
        // }

        // ADD AWAKENING PASSIVES LV50
        if (this.characters[index].awakeningPassives !== undefined && this.params.addPassives) {
          if (prop === 'HP' || prop === 'mBRV') {
            fullStat += (this.characters[index].awakeningPassives[prop] * 3)
          } else if (prop === 'ATK' || prop === 'DEF') {
            fullStat += (this.characters[index].awakeningPassives[prop] * 2)
          }
        }

        // ADD AWAKENING PASSIVES LV60
        if (this.params.lv60ready && this.params.addPassives && this.characters[index].lv60.awakeningPassives !== undefined) {
          if (prop === 'ATK' || prop === 'DEF') {
            fullStat += parseInt(this.characters[index].lv60.awakeningPassives[prop])
          }
        }

        // ADD AWAKENING PASSIVES LV60
        if ((prop === 'ATK') && this.params.addArtifact) {
          fullStat += (108 * 3)
        }

        // ADD FOUR STAR GEAR PASSIVES
        if (this.characters[index].fourStarPassives !== undefined && this.params.addFourStar) {
          if (this.characters[index].fourStarPassives.weapon !== undefined && this.characters[index].fourStarPassives.weapon[prop] !== undefined) {
            fullStat += this.characters[index].fourStarPassives.weapon[prop]
          }
          if (this.characters[index].fourStarPassives.armor !== undefined && this.characters[index].fourStarPassives.armor[prop] !== undefined) {
            fullStat += this.characters[index].fourStarPassives.armor[prop]
          }
        }
      }
      return fullStat
    },
    removeAwakeningStats: function (prop, index) {
      // TODO Switch calculation to add awakening to raw stats for Lv50
      let baseStat = this.characters[index].base[prop]
      if (this.params.lv60ready && this.characters[index].lv60 !== false) {
        // Add LvUP 51 to 60 Stat UPs
        baseStat += parseInt(this.characters[index].lv60.lvUp[prop] * 10)
        // Add Awakening Stat UP (if not initial BRV stat)
        if (this.characters[index].lv60.statUp[prop] !== undefined && this.params.addAwakening) {
          baseStat += parseInt(this.characters[index].lv60.statUp[prop])
        }
      }
      if (!this.params.addAwakening) {
        switch (prop) {
          case 'iBRV':
            return baseStat
          case 'mBRV':
            baseStat -= parseInt(Math.ceil(this.characters[index].awakeningPassives[prop] / 2) * 9)
            return baseStat
          case 'HP':
            baseStat -= parseInt(((this.characters[index].awakeningPassives[prop] + 100) / 2) * 10)
            return baseStat
          default:
            baseStat -= parseInt(Math.ceil(this.characters[index].awakeningPassives[prop] / 2) * 10)
            return baseStat
        }
      }
      return baseStat
    },
    getBaseSynergyValue: function (prop, index) {
      let baseSynergyVal = this.removeAwakeningStats(prop, index)
      if (this.params.addSynergy && !this.params.baseOnly) {
        baseSynergyVal += parseInt(this.characters[index].base[prop] * 0.5)
      }
      return baseSynergyVal
    },
    getGearSynergyValue: function (prop, type, index) {
      let gearSynergyVal = this.characters[index][type].stats[prop]
      if (this.params.addSynergy) {
        gearSynergyVal += parseInt(this.characters[index][type].stats[prop] * 0.3)
      }
      return gearSynergyVal
    },
    getMinMax: function (prop) {
      let minMax = []
      minMax[0] = Math.min.apply(Math, this.listCharacters().map(function (character) { return character.full[prop] }))
      minMax[1] = Math.max.apply(Math, this.listCharacters().map(function (character) { return character.full[prop] }))
      return minMax
    },
    getMinMaxStats: function () {
      let minMaxStats = { HP: [], iBRV: [], mBRV: [], ATK: [], DEF: [] }

      minMaxStats.HP = this.getMinMax('HP')
      minMaxStats.iBRV = this.getMinMax('iBRV')
      minMaxStats.mBRV = this.getMinMax('mBRV')
      minMaxStats.ATK = this.getMinMax('ATK')
      minMaxStats.DEF = this.getMinMax('DEF')

      return minMaxStats
    },
    baseStatsTotal: function (row) {
      let base = parseInt(row.base.HP + row.base.iBRV + row.base.mBRV + row.base.ATK + row.base.DEF)

      if (this.params.lv60ready) {
        base += parseInt(row.lv60.statUp.HP + row.lv60.statUp.mBRV + row.lv60.statUp.ATK + row.lv60.statUp.DEF)
        base += parseInt(row.lv60.lvUp.HP + row.lv60.lvUp.iBRV + row.lv60.lvUp.mBRV + row.lv60.lvUp.ATK + row.lv60.lvUp.DEF) * 10
      }
      return base
    },
    prepareFullStats: function () {
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i].full.HP = this.fullStat('HP', i)
        this.characters[i].full.iBRV = this.fullStat('iBRV', i)
        this.characters[i].full.mBRV = this.fullStat('mBRV', i)
        this.characters[i].full.ATK = this.fullStat('ATK', i)
        this.characters[i].full.DEF = this.fullStat('DEF', i)
      }
    },
    setupStats: function () {
      this.prepareFullStats()
      this.minMaxValues = this.getMinMaxStats()
    },
    isExtremum: function (prop, value) {
      if (value === this.minMaxValues[prop][0]) {
        return 'lowest'
      } else if (value === this.minMaxValues[prop][1]) {
        return 'highest'
      }
    }
  }
}
