<template>
  <div class="ranking">
    <h2 class="header">DFF Opera Omnia Ranking</h2>
    <div class="notes">
      <p>Stat values in this table are based on Lv50 fully awakened characters and 6* 35CP weapon/armor.</p>
      <p>Characters marked with a &#10007; don't have a 35CP weapon. 6* 15CP stats are used instead.</p>
    </div>

    <div class="base-checkbox">
      <input type="checkbox" id="baseStats" v-model="params.baseOnly">
      <label for="baseStats">Show base stats only</label>
    </div>
    <div class="gear-checkboxes">
      <input type="checkbox" id="addW" :disabled="params.baseOnly ? true : false" v-model="params.addWeapon">
      <label for="addW">35cp stats</label>
      <input type="checkbox" id="addA" :disabled="params.baseOnly ? true : false" v-model="params.addArmor">
      <label for="addA">5* armor</label>
      <input type="checkbox" id="addS" :disabled="params.baseOnly ? true : false" v-model="params.addSynergy">
      <label for="addS">Synergy</label>
    </div>
    <div class="passive-checkboxes">
      <input type="checkbox" id="addP" :disabled="params.baseOnly ? true : false" v-model="params.addPassives">
      <label for="addP">Lv50 passives (20 CP)</label>
      <input type="checkbox" id="addF" :disabled="params.baseOnly ? true : false" v-model="params.addFourStar">
      <label for="addF">4* passives (7 CP)</label>
    </div>
    <vue-good-table
      :columns="columns"
      :rows="characters"
      :globalSearch="true"
      :lineNumbers="false"
      :defaultSortBy="{field: 'id', type: 'asc'}"
      globalSearchPlaceholder="Search by character, attribute or stat"
      styleClass="ranking-table">
      <template slot="table-row" slot-scope="props">
        <td :title="props.row.character" :class="isFinished(props.row)">
          <span class="icon" :style="{ backgroundImage: 'url(' + characterIcon(props.row.character) + ')'}"></span>
          {{ props.row.character }}
        </td>
        <td>{{ props.row.series.name }}</td>
        <td class="attributes">
          <template v-for="attribute in props.row.attributes">
            <span :title="attribute" :class="attribute"></span> 
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
      </template>
      <div slot="emptystate" class="ranking-disclaimer">
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
        addWeapon: false,
        addArmor: false,
        addPassives: false,
        addFourStar: false,
        addSynergy: false
      },
      minMaxValues: {},
      columns: [
        {
          label: 'Order',
          field: 'id',
          type: 'number',
          filterable: false,
          hidden: true,
          sortable: false
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
        }
      ],
      characters: []
    }
  },
  methods: {
    setCharactersTable: function () {
      if (require('../assets/data.json') !== undefined) {
        this.characters = require('../assets/data.json')
      } else {
        this.characters = []
        console.log("Can't find data.json")
      }
    },
    characterIcon: function (character) {
      let slug = character.toLowerCase().split(' ').join('_').split('\'').join('')
      if (require('../assets/icons/' + slug + '.png') !== undefined) {
        return require('../assets/icons/' + slug + '.png')
      } else {
        return null
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
    getBaseSynergyValue: function (prop, index) {
      let baseSynergyVal = this.characters[index].base[prop]
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
  padding: 15px 5px;
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

div.notes p {
  margin: 2.5px auto;
}

/* Ranking Table styles */

.ranking-table {
  text-align: center;
  max-width: 900px;
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

.ranking-table th.ranking-disclaimer {
  font-size: 11px;
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

input[type=checkbox] {
  width: 16px;
}

.base-checkbox, .gear-checkboxes, .passive-checkboxes {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5px;
  font-family: 'Open Sans', sans-serif;
}

/* Markers */

.highest {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}

.lowest {
  color: #303f9f;
  font-weight: bold;
  font-size: 12px;
}

.exclusiveMissing:after {
  content: '\2718';
  display: inline-block;
}

/* Attribute classes */

.Dark {
  background-image: url('../assets/dark.png');
  background-position: center;
  background-size: cover;
}

.Holy {
  background-image: url('../assets/holy.png');
  background-position: center;
  background-size: cover;
}

.Earth {
  background-image: url('../assets/earth.png');
  background-position: center;
  background-size: cover;
}

.Wind {
  background-image: url('../assets/wind.png');
  background-position: center;
  background-size: cover;
}

.Water {
  background-image: url('../assets/water.png');
  background-position: center;
  background-size: cover;
}

.Thunder {
  background-image: url('../assets/thunder.png');
  background-position: center;
  background-size: cover;
}

.Ice {
  background-image: url('../assets/ice.png');
  background-position: center;
  background-size: cover;
}

.Fire {
  background-image: url('../assets/fire.png');
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

  tbody tr {
    box-shadow: none;
  }
}

@media screen and (max-width: 480px) {
  .ranking-table tr th:nth-child(2), .ranking-table tr td:nth-child(2), .ranking-table tr th:nth-child(3), .ranking-table tr td:nth-child(3) {
    display: none;
  }

  .ranking-table th span {
    font-size: 10px;
  }
  
  .ranking-table td {
    font-size: 12px;
  }

  .highest {
    font-size: 14px;
  }

  .lowest {
    font-size: 10px;
  }

  .exclusiveMissing:after {
    content: '\2718';
    display: inline-block;
    font-size: 12px;
  }
}
</style>
