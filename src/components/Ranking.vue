<template>
  <div class="ranking">
    <h3 class="header">Welcome to DFFOO-Ranking</h3>
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
        <td :title="props.row.character" :class="isFinished(props.row) ? false : unfinishedClass">
          <span class="icon" :style="{ backgroundImage: 'url(' + characterIcon(props.row.character) + ')'}"></span>
          {{ props.row.character }}
        </td>
        <td>{{ props.row.series.name }}</td>
        <td class="attributes">
          <template v-for="attribute in props.row.attributes">
            <span :title="attribute" :class="attribute"></span> 
          </template>
        </td>
        <template v-if="params.baseOnly">
          <td>
            <template v-if="props.row.HP === minMaxValues.HP[1]">
              <span class="highest">{{ props.row.HP }}</span>
            </template>
            <template v-else-if="props.row.HP === minMaxValues.HP[0]">
              <span class="lowest">{{ props.row.HP }}</span>
            </template>
            <template v-else>{{ props.row.HP }}</template>
          </td>
          <td>
            <template v-if="props.row.initialBRV === minMaxValues.initialBRV[1]">
              <span class="highest">{{ props.row.initialBRV }}</span>
            </template>
            <template v-else-if="props.row.initialBRV === minMaxValues.initialBRV[0]">
              <span class="lowest">{{ props.row.initialBRV }}</span>
            </template>
            <template v-else>{{ props.row.initialBRV }}</template>
          </td>
          <td>
            <template v-if="props.row.maxBRV === minMaxValues.maxBRV[1]">
              <span class="highest">{{ props.row.maxBRV }}</span>
            </template>
            <template v-else-if="props.row.maxBRV === minMaxValues.maxBRV[0]">
              <span class="lowest">{{ props.row.maxBRV }}</span>
            </template>
            <template v-else>{{ props.row.maxBRV }}</template>
          </td>
          <td>
            <template v-if="props.row.ATK === minMaxValues.ATK[1]">
              <span class="highest">{{ props.row.ATK }}</span>
            </template>
            <template v-else-if="props.row.ATK === minMaxValues.ATK[0]">
              <span class="lowest">{{ props.row.ATK }}</span>
            </template>
            <template v-else>{{ props.row.ATK }}</template>
          </td>
          <td>
            <template v-if="props.row.DEF === minMaxValues.DEF[1]">
              <span class="highest">{{ props.row.DEF }}</span>
            </template>
            <template v-else-if="props.row.DEF === minMaxValues.DEF[0]">
              <span class="lowest">{{ props.row.DEF }}</span>
            </template>
            <template v-else>{{ props.row.DEF }}</template>
          </td>
        </template>
        <template v-else>
          <td>
            <template v-if="props.row.fullHP === minMaxValues.HP[1]">
              <span class="highest">{{ props.row.fullHP }}</span>
            </template>
            <template v-else-if="props.row.fullHP === minMaxValues.HP[0]">
              <span class="lowest">{{ props.row.fullHP }}</span>
            </template>
            <template v-else>{{ props.row.fullHP }}</template>
          </td>
          <td>
            <template v-if="props.row.fullInitialBRV === minMaxValues.initialBRV[1]">
              <span class="highest">{{ props.row.fullInitialBRV }}</span>
            </template>
            <template v-else-if="props.row.fullInitialBRV === minMaxValues.initialBRV[0]">
              <span class="lowest">{{ props.row.fullInitialBRV }}</span>
            </template>
            <template v-else>{{ props.row.fullInitialBRV }}</template>
          </td>
          <td>
            <template v-if="props.row.fullMaxBRV === minMaxValues.maxBRV[1]">
              <span class="highest">{{ props.row.fullMaxBRV }}</span>
            </template>
            <template v-else-if="props.row.fullMaxBRV === minMaxValues.maxBRV[0]">
              <span class="lowest">{{ props.row.fullMaxBRV }}</span>
            </template>
            <template v-else>{{ props.row.fullMaxBRV }}</template>
          </td>
          <td>
            <template v-if="props.row.fullATK === minMaxValues.ATK[1]">
              <span class="highest">{{ props.row.fullATK }}</span>
            </template>
            <template v-else-if="props.row.fullATK === minMaxValues.ATK[0]">
              <span class="lowest">{{ props.row.fullATK }}</span>
            </template>
            <template v-else>{{ props.row.fullATK }}</template>
          </td>
          <td>
            <template v-if="props.row.fullDEF === minMaxValues.DEF[1]">
              <span class="highest">{{ props.row.fullDEF }}</span>
            </template>
            <template v-else-if="props.row.fullDEF === minMaxValues.DEF[0]">
              <span class="lowest">{{ props.row.fullDEF }}</span>
            </template>
            <template v-else>{{ props.row.fullDEF }}</template>
          </td>
        </template>
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
        // {
        //   label: 'Series Name',
        //   field: 'series.name',
        //   filterable: true,
        //   hidden: true,
        //   sortable: false
        // },
        {
          label: 'Attributes',
          field: 'attributes',
          filterable: false,
          sortable: false
        },
        {
          label: 'HP',
          field: 'HP',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'Initial BRV',
          field: 'initialBRV',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'Max BRV',
          field: 'maxBRV',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'ATK',
          field: 'ATK',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        },
        {
          label: 'DEF',
          field: 'DEF',
          type: 'number',
          filterable: true,
          hidden: false,
          sortable: true
        }
        // {
        //   label: 'BST',
        //   // for base stats total sorting
        //   field: this.baseStatsTotal,
        //   type: 'number',
        //   filterable: true,
        //   sortable: true
        // }
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
    baseStatsTotal: function (row) {
      return parseInt(row.HP + row.initialBRV + row.maxBRV + row.ATK + row.DEF)
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
      if (this.characters[index].weapon !== undefined && this.params.addWeapon) {
        fullStat += this.getGearSynergyValue(prop, 'weapon', index)
        fullStat += parseInt(this.characters[index].weapon.stats[prop] / 5)
      }
      if (this.characters[index].armor !== undefined && this.params.addArmor) {
        fullStat += this.getGearSynergyValue(prop, 'armor', index)
        fullStat += parseInt(this.characters[index].armor.stats[prop] / 5)
        if (this.characters[index].armor.bonus[prop] !== undefined) {
          fullStat += this.characters[index].armor.bonus[prop]
        }
      }
      if (this.characters[index].awakeningPassives !== undefined && this.params.addPassives) {
        if (prop === 'HP' || prop === 'maxBRV') {
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
      return fullStat
    },
    getBaseSynergyValue: function (prop, index) {
      let baseSynergyVal = this.characters[index][prop]
      if (this.params.addSynergy) {
        baseSynergyVal += parseInt(this.characters[index][prop] * 0.5)
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
    getMinMaxStats: function () {
      let minMax = {
        HP: [],
        initialBRV: [],
        maxBRV: [],
        ATK: [],
        DEF: []
      }
      if (this.params.baseOnly) {
        minMax.HP[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.HP }))
        minMax.HP[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.HP }))
        minMax.initialBRV[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.initialBRV }))
        minMax.initialBRV[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.initialBRV }))
        minMax.maxBRV[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.maxBRV }))
        minMax.maxBRV[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.maxBRV }))
        minMax.ATK[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.ATK }))
        minMax.ATK[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.ATK }))
        minMax.DEF[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.DEF }))
        minMax.DEF[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.DEF }))
      } else {
        minMax.HP[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.fullHP }))
        minMax.HP[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.fullHP }))
        minMax.initialBRV[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.fullInitialBRV }))
        minMax.initialBRV[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.fullInitialBRV }))
        minMax.maxBRV[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.fullMaxBRV }))
        minMax.maxBRV[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.fullMaxBRV }))
        minMax.ATK[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.fullATK }))
        minMax.ATK[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.fullATK }))
        minMax.DEF[0] = Math.min.apply(Math, this.characters.map(function (character) { return character.fullDEF }))
        minMax.DEF[1] = Math.max.apply(Math, this.characters.map(function (character) { return character.fullDEF }))
      }
      return minMax
    },
    setupStats: function () {
      if (!this.params.baseOnly) {
        this.columns[4].field = 'fullHP'
        this.columns[5].field = 'fullInitialBRV'
        this.columns[6].field = 'fullMaxBRV'
        this.columns[7].field = 'fullATK'
        this.columns[8].field = 'fullDEF'
      } else {
        this.columns[4].field = 'HP'
        this.columns[5].field = 'initialBRV'
        this.columns[6].field = 'maxBRV'
        this.columns[7].field = 'ATK'
        this.columns[8].field = 'DEF'
      }
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i].fullHP = this.fullStat('HP', i)
        this.characters[i].fullInitialBRV = this.fullStat('initialBRV', i)
        this.characters[i].fullMaxBRV = this.fullStat('maxBRV', i)
        this.characters[i].fullATK = this.fullStat('ATK', i)
        this.characters[i].fullDEF = this.fullStat('DEF', i)
      }
      this.minMaxValues = this.getMinMaxStats()
    },
    isFinished: function (row) {
      if (row.weapon.notes === undefined) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.setCharactersTable()
    this.setupStats()
  },
  watch: {
    'params.baseOnly': function () {
      this.setupStats()
    },
    'params.addWeapon': function () {
      this.setupStats()
    },
    'params.addArmor': function () {
      this.setupStats()
    },
    'params.addPassives': function () {
      this.setupStats()
    },
    'params.addFourStar': function () {
      this.setupStats()
    },
    'params.addSynergy': function () {
      this.setupStats()
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

div.ranking {
  max-width: 910px;
  min-width: 500px;
  background-color: #43517a;
  margin: 0 auto;
  border-radius: 5px;
  padding: 15px 5px;
  box-shadow: inset 0 0 10px #000000;
}

div.notes {
  font-size: 13px;
  margin-bottom: 15px;
}

div.notes p {
  margin: 0;
}

/* Ranking Table styles */

table, .ranking-table {
  text-align: center;
  max-width: 900px;
  min-width: 490px;
  font-size: 14px;
  margin: 0 auto;
  font-family: 'Open Sans', sans-serif;
}

.ranking-table th, .ranking-table th.sorting-asc, .ranking-table th.sorting-desc {
  padding: 10px;
  color: #ccc !important;
  font-size: 10px;
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */      
}

thead tr:nth-child(2) {
  box-shadow: inset 0 0 10px #000000;
  background-color: #273153;
}

table th.sorting-desc:after {
  border-top-color: #cfd8dc !important;
  margin: 6px !important;
}

table th.sorting-asc:after {
  border-bottom-color: #cfd8dc !important;
  margin: 6px !important;
}

table th span {
  font-size: 12px;
}

.ranking-table tbody {
  background-color: #bdbdbd;
  box-shadow: inset 0px 10px 14px -10px #000000,  inset 0px -10px 14px -10px #000000;
}

tbody tr:nth-child(2n) {  
  background-color: #acacac;
}

tbody tr {
  box-shadow: inset -10px 0px 14px -10px #000000,  inset 10px 0px 14px -10px #000000;

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

/*.ranking-table td.for-search, .ranking-table th:nth-child(2) {
  display: none;
}*/

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

table .global-search-icon {
  display: none;
}

table .global-search {
  padding: 0 !important;
}

table td[colspan], table td[colspan]:hover {
  background-color: transparent;
  padding-bottom: 5px;
}

table .left-align, table .right-align {
  text-align: center !important;
}

.responsive {
  overflow: hidden !important;
}


/* Inputs */

input[type=text] {
  display: block;
  width: 50% !important;
  flex: 1;
  padding: 0.9em 1em;
  background-color: #273153;
  color: #ccc;
  border-style: none;
  border-radius: 5px;
  box-shadow: inset 0 0 10px #000000;
  margin: 15px auto;
  margin-top: 5px;
}

input[type=text]::placeholder {
  color: #ccc;
}

input[type=checkbox], label {
  font-size: 14px;
  height: 16px;
  vertical-align: middle;
  display: inline-block;
}

input[type=checkbox] {
  width: 16px;
}

.base-checkbox, .gear-checkboxes, .passive-checkboxes {
  width: 400px;
  margin: 0 auto;
  margin-bottom: 5px;
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
</style>
