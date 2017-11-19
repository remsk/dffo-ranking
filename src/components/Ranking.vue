<template>
  <div class="ranking">
    <h2 class="header">DFF Opera Omnia Ranking</h2>
    <div class="notes">
      <p>Stat values in this table are based on Lv50 fully awakened characters and 6* 35CP weapon/armor.</p>
      <p>Characters marked with a &#10007; don't have a 35CP weapon. 6* 15CP stats are used instead.</p>
    </div>

    <div class="base-checkbox">
      <input type="checkbox" id="baseStats" v-model="params.baseOnly">
      <label title="Show base stats only" for="baseStats">Base stats only</label>
    </div>
    <table class="additional-options" v-if="!params.baseOnly">
      <tbody>
        <tr>
          <td title="Equip 6* exclusive weapon">
            <input type="checkbox" id="addW" :disabled="params.baseOnly ? true : false" v-model="params.addWeapon">
            <label for="addW">Weapon</label>
          </td>
          <td title="Equip 6* armor and its passive">
            <input type="checkbox" id="addA" :disabled="params.baseOnly ? true : false" v-model="params.addArmor">
            <label for="addA">Armor</label>
          </td>
        </tr>
        <tr>
          <td title="Equip Lv5 to Lv50 stat passives (20CP)">
            <input type="checkbox" id="addP" :disabled="params.baseOnly ? true : false" v-model="params.addPassives">
            <label for="addP">Lv50 Passives</label>
        </td>
          <td title="Equip 4* weapon and armor passives (7CP)">
            <input type="checkbox" id="addF" :disabled="params.baseOnly ? true : false" v-model="params.addFourStar">
            <label for="addF">4* Passives</label>
          </td>
        </tr>
        <tr>
          <td title="Equip ATK passives only">
            <input type="checkbox" id="addATK" :disabled="params.baseOnly ? true : false" v-model="params.ATKOnly">
            <label for="addATK">ATK only</label>
          </td>
          <td title="Enable synergy bonus">
            <input type="checkbox" id="addS" :disabled="params.baseOnly ? true : false" v-model="params.addSynergy">
            <label for="addS">Synergy</label>
          </td>
        </tr>
      </tbody>
    </table>
    <vue-good-table
      :columns="columns"
      :rows="characters"
      :globalSearch="true"
      :lineNumbers="false"
      :defaultSortBy="{field: 'id', type: 'desc'}"
      secondarySortType="asc"
      globalSearchPlaceholder="Search by character, attribute or stat"
      styleClass="ranking-table">
      <template slot="table-column" slot-scope="props">
        <span :title="(props.column.label === 'BST' ? 'Base stats total' : false)">{{ props.column.label }}</span>
      </template>
      <template slot="table-row" slot-scope="props">
        <td :title="props.row.character" :class="isFinished(props.row)">
          <span class="icon" :style="characterIcon(props.row.character) ? { backgroundImage: 'url(' + characterIcon(props.row.character) + ')'} : false"></span>
          {{ props.row.character }}
        </td>
        <td>{{ props.row.series.name }}</td>
        <td class="attributes">
          <template v-if="props.row.attributes.length > 0">
            <span v-for="attribute in props.row.attributes" :title="attribute" class="attribute" :style="attributeIcon(attribute) ? { backgroundImage: 'url(' + attributeIcon(attribute) + ')'} : false"></span> 
          </template>
        </td>
        <td>
          <span :class="isExtremum('HP', props.row.full.HP)">{{ props.row.full.HP }}</span>
        </td>
        <td>
          <span :class="isExtremum('iBRV', props.row.full.iBRV)">{{ props.row.full.iBRV }}</span>
        </td>
        <td>
          <span :class="isExtremum('mBRV', props.row.full.mBRV)">{{ props.row.full.mBRV }}</span>
        </td>
        <td>
          <span :class="isExtremum('ATK', props.row.full.ATK)">{{ props.row.full.ATK }}</span>
        </td>
        <td>
          <span :class="isExtremum('DEF', props.row.full.DEF)">{{ props.row.full.DEF }}</span>
        </td>
        <td class="bst"><span>{{ baseStatsTotal(props.row) }}</span></td>
      </template>
      <div slot="emptystate" class="empty">
        No results
      </div>
    </vue-good-table>
  </div>
</template>

<script>
export default {
  name: 'Ranking',
  data () {
    return {
      unfinishedClass: 'exclusiveMissing',
      params: {
        baseOnly: true,
        addAwakening: true,
        addWeapon: true,
        addArmor: true,
        addPassives: true,
        addFourStar: false,
        addSynergy: false,
        ATKOnly: false
      },
      minMaxValues: {},
      columns: [
        {
          label: 'Order',
          field: 'id',
          type: 'number',
          filterable: false,
          hidden: true
        },
        {
          label: 'Character',
          field: 'character',
          filterable: true,
          sortable: true
        },
        {
          label: 'Series',
          field: 'series.id',
          filterable: false,
          sortable: true
        },
        {
          label: 'Attributes',
          field: 'attributes',
          filterable: false,
          sortable: false
        },
        {
          label: 'HP',
          field: 'full.HP',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'Initial BRV',
          field: 'full.iBRV',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'Max BRV',
          field: 'full.mBRV',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'ATK',
          field: 'full.ATK',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'DEF',
          field: 'full.DEF',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'BST',
          field: this.baseStatsTotal,
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        }
      ],
      characters: []
    }
  },
  methods: {
    setCharactersTable: function () {
      try {
        this.characters = require('./data.json')
      } catch (e) {
        console.log('Unable to load database.')
      }
    },
    characterIcon: function (character) {
      let slug = character.toLowerCase().split(' ').join('_').split('\'').join('')
      try {
        return require('./images/icons/characters/' + slug + '.png')
      } catch (e) {
        return false
      }
    },
    attributeIcon: function (attribute) {
      let slug = attribute.toLowerCase().split(' ').join('_').split('\'').join('')
      try {
        return require('./images/icons/attributes/' + slug + '.png')
      } catch (e) {
        return false
      }
    },
    fullStat: function (prop, index) {
      let fullStat = this.getBaseSynergyValue(prop, index)
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
        if (this.params.ATKOnly && prop !== 'ATK') {
          return fullStat
        }
        if (this.characters[index].awakeningPassives !== undefined && this.params.addPassives) {
          if (prop === 'HP' || prop === 'mBRV') {
            fullStat += (this.characters[index].awakeningPassives[prop] * 3)
          } else if (prop === 'ATK' || prop === 'DEF') {
            fullStat += (this.characters[index].awakeningPassives[prop] * 2)
          }
        }
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
    addAwakeningStats: function (prop, index) {
      let baseStat = this.characters[index].base[prop]
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
      let baseSynergyVal = this.addAwakeningStats(prop, index)
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
      minMax[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.full[prop] }))
      minMax[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.full[prop] }))
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
    prepareFullStats: function () {
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i].full.HP = this.fullStat('HP', i)
        this.characters[i].full.iBRV = this.fullStat('iBRV', i)
        this.characters[i].full.mBRV = this.fullStat('mBRV', i)
        this.characters[i].full.ATK = this.fullStat('ATK', i)
        this.characters[i].full.DEF = this.fullStat('DEF', i)
      }
    },
    baseStatsTotal: function (row) {
      return parseInt(row.base.HP + row.base.iBRV + row.base.mBRV + row.base.ATK + row.base.DEF)
    },
    setupStats: function () {
      this.prepareFullStats()
      this.minMaxValues = this.getMinMaxStats()
    },
    isFinished: function (row) {
      if (row.exclusiveWeapon === undefined) {
        return this.unfinishedClass
      }
    },
    isExtremum: function (prop, value) {
      if (value === this.minMaxValues[prop][0]) {
        return 'lowest'
      } else if (value === this.minMaxValues[prop][1]) {
        return 'highest'
      }
    }
  },
  created () {
    this.setCharactersTable()
    this.setupStats()
  },
  watch: {
    'params': {
      handler: function () {
        this.setupStats()
      },
      deep: true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Karla|Open+Sans');

div.ranking {
  max-width: 910px;
  background-color: #43517a;
  margin: 0 auto;
  border-radius: 5px;
  padding: 15px;
  box-shadow: inset 0 0 10px #000000;
}

 h2 {
  font-family: 'Karla', sans-serif;
  text-transform: uppercase;
}

div.notes {
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 15px;
  padding: 0 15px;
}

p {
  margin: 2.5px auto;
}

input[type=checkbox] {
  width: 16px;
}

.additional-options tr, .base-checkbox {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5px;
  font-family: 'Open Sans', sans-serif;
}

.additional-options {
  max-width: 480px;
  margin: 0 auto;
}

.additional-options td {
  text-align: left;
}

/* Ranking Table styles */

.ranking-table {
  text-align: center;
  font-size: 14px;
  margin: 0 auto;
}

.ranking-table th, .ranking-table th.sorting-asc, .ranking-table th.sorting-desc {
  padding: 10px;
  color: #ccc !important;
  font-size: 10px;
  cursor: pointer;
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */      
}

.ranking-table th:hover {
  color: #eee !important;
}

.ranking-table thead tr:nth-child(2) {
  box-shadow: inset 0 0 10px #000000;
  background-color: #273153;
}

.ranking-table th.sorting-desc:after {
  border-top-color: #cfd8dc !important;
  margin: 6px !important;
}

.ranking-table th.sorting-asc:after {
  border-bottom-color: #cfd8dc !important;
  margin: 6px !important;
}

.ranking-table th span {
  font-size: 12px;
}

.ranking-table tbody {
  font-family: 'Open Sans', sans-serif;
  background-color: #bdbdbd;
  box-shadow: inset 0px 10px 14px -10px #000000,  inset 0px -10px 14px -10px #000000;
}

.ranking-table tbody tr {
  box-shadow: inset -10px 0px 14px -10px #000000,  inset 10px 0px 14px -10px #000000;
}

.ranking-table tbody tr:nth-child(2n) {  
  background-color: #acacac;
}

.ranking-table td {
  color: #212121;
  padding: 5px 5px;
  padding-top: 8px;
  width: 100px;
}

.ranking-table td[title] {
  width: 150px;
  font-weight: bold;
}

.ranking-table td.attributes, td.role {
  width: 125px;
}

.ranking-table td span.icon {
  background-size: contain;
  background-repeat: no-repeat;
  width: 66.5px;
  height: 45px;
  display: block;
  margin: 0 auto;
}

.ranking-table div.empty {
  font-size: 14px;
  padding: 10px 5px;
  padding-top: 7px;
}

.ranking-table td.attributes span {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: 0 3px;
  vertical-align: middle;
}

.ranking-table .global-search-icon {
  display: none;
}

.ranking-table .global-search {
  padding: 0 !important;
}

.ranking-table td[colspan], .ranking-table td[colspan]:hover {
  background-color: transparent;
  padding-bottom: 5px;
}

.ranking-table .left-align, .ranking-table .right-align {
  text-align: center !important;
}

.responsive {
  overflow: hidden !important;
}

/* Inputs */

input[type=text] {
  display: block;
  max-width: 400px;
  flex: 1;
  padding: 0.9em 1em;
  background-color: #273153;
  color: #ccc;
  border-style: none;
  border-radius: 5px;
  box-shadow: inset 0 0 10px #000000;
  margin: 15px auto;
  margin-top: 5px;
  font-family: 'Open Sans', sans-serif;
}

input[type=text]::placeholder {
  color: #ccc;
}

input[type=checkbox], label {
  font-size: 14px;
  height: 16px;
  vertical-align: top;
  display: inline-block;
}

/* Markers */

.highest {
  color: #d32f2f;
  font-weight: bold;
  font-size: 1.15em;
}

.lowest {
  color: #303f9f;
  font-weight: bold;
  font-size: 0.85em;
}

.bst {
  background-color: rgba(39, 49, 83, 0.2);
}

.bst span {
  color: rgb(39, 49, 83);
  font-weight: bold;
}

.exclusiveMissing:after {
  content: '\2718';
  display: inline-block;
}

.attribute {
  background-position: center;
  background-size: cover;
}

/* IE and Edge */

@supports (-ms-ime-align: auto) {
  thead tr:nth-child(2) {
    box-shadow: none;
  }

  .ranking-table tbody {
    box-shadow: none;
  }

  tbody tr, thead tr {
    box-shadow: none !important;
  }
}

@media screen and (max-width: 768px) {
  .ranking-table tr th:nth-child(10), .ranking-table tr td:nth-child(10) {
    display: none;
  }
}

@media screen and (max-width: 560px) {
  .ranking-table tr th:nth-child(3), .ranking-table tr td:nth-child(3), .ranking-table tr th:nth-child(4), .ranking-table tr td:nth-child(4) {
    display: none;
  }
}

@media screen and (max-width: 480px) {

  .ranking-table th span {
    font-size: 10px;
  }
  
  .ranking-table td {
    font-size: 12px;
  }

  .ranking-table th.sorting-asc:after, .ranking-table th.sorting-desc:after {
    margin: 5px 4px !important;
    border-width: 4px !important;
  }

  .exclusiveMissing:after {
    content: '\2718';
    display: inline-block;
    font-size: 12px;
  }
}

@media screen and (max-width: 480px) {
  
  .ranking-table td span.icon {
    width: 49.875px;
    height: 33.75px;
  }

  .ranking-table td {
    font-size: 0.75em;
    padding: 3px;
    padding-top: 6px;
  }
}

@media screen and (max-width: 380px) {
  .ranking-table tr th:nth-child(2), .ranking-table tr td:nth-child(2) {
    display: none;
  }
}
</style>
