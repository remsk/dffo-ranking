<template>
  <div class="ranking">
    <h2 class="header">DFF Opera Omnia Ranking</h2>
    <ul class="notes">
      <template v-if="params.lv60ready">
        <li>Stat values are based on Lv60 fully awakened characters and 6* exclusive weapon/armor.</li>
      </template>
      <template v-else>
        <li>Stat values are based on Lv50 fully awakened characters and 6* exclusive weapon/armor.</li>
      </template>
      <li>15CP weapons are used for characters lacking their exclusive weapon. (marked with <strong>&#10007;</strong>)</li>
    </ul>
    <div class="ranking-options">
      <div class="ranking-level">
        <label title="Show all characters" for="lv50"><input type="radio" id="lv50" v-model="params.lv60ready" :value="false">Lv50</label>
        <label title="Show only Lv60 ready characters™" for="lv60"><input type="radio" id="lv60" v-model="params.lv60ready" :value="true">Lv60</label>
      </div>
      <div class="base-checkbox">
        <label title="Show base stats only" for="baseStats"><input type="checkbox" id="baseStats" v-model="params.baseOnly">Base stats only</label>
        <label for="compactVersion"><input type="checkbox" id="compactVersion" v-model="compact">Compact</label>
      </div>
      <table class="additional-options" v-if="!params.baseOnly">
        <tbody>
          <tr>
            <td title="Equip 6* exclusive weapon">
              <label for="addW">Weapon<input type="checkbox" id="addW" :disabled="params.baseOnly ? true : false" v-model="params.addWeapon"></label>
            </td>
            <td title="Equip 6* armor and its passive">
              <label for="addA"><input type="checkbox" id="addA" :disabled="params.baseOnly ? true : false" v-model="params.addArmor">Armor</label>
            </td>
          </tr>
          <tr>
            <template v-if="params.lv60ready">
              <td title="Equip Lv5 to Lv60 stat passives (30CP)">
                <label for="addP">Lv60 Passives<input type="checkbox" id="addP" :disabled="params.baseOnly ? true : false" v-model="params.addPassives"></label>
              </td>
            </template>
            <template v-else>
              <td title="Equip Lv5 to Lv50 stat passives (20CP)">
                <label for="addP">Lv50 Passives<input type="checkbox" id="addP" :disabled="params.baseOnly ? true : false" v-model="params.addPassives"></label>
              </td>
            </template>
            <td title="Equip 4* weapon and armor passives (7CP)">
              <label for="addF"><input type="checkbox" id="addF" :disabled="params.baseOnly ? true : false" v-model="params.addFourStar">4* Passives</label>
            </td>
          </tr>
          <tr>
            <td title="Equip 108 ATK artifact passives (from 15 to 45CP)">
              <label for="addArtifact">108 ATK x3<input type="checkbox" id="addArtifact" :disabled="params.baseOnly ? true : false" v-model="params.addArtifact"></label>
            </td>
            <td title="Enable synergy bonus">
              <label for="addS"><input type="checkbox" id="addS" :disabled="params.baseOnly ? true : false" v-model="params.addSynergy">Synergy</label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <vue-good-table
      :columns="columns"
      :rows="listCharacters()"
      :globalSearch="true"
      :lineNumbers="false"
      :defaultSortBy="{field: 'id', type: 'desc'}"
      secondarySortType="asc"
      globalSearchPlaceholder="Search by character, attribute or stat"
      styleClass="ranking-table">
      <template slot="table-row" slot-scope="props">
        <td :class="isFinished(props.row) + ' character'">
          <span v-show="!compact" @click="openCharacterPage(props.row.name)" class="icon" :style="fetchIcon(props.row.name, 'characters') ? { backgroundImage: 'url(' + fetchIcon(props.row.name, 'characters') + ')'} : false"></span>
          {{ props.row.name }}
        </td>
        <td>{{ props.row.series.name }}</td>
        <td class="attributes">
          <template v-if="props.row.attributes.length > 0">
            <span v-for="attribute in props.row.attributes" :title="attribute" :class="!compact ? 'big' : 'small'" :style="fetchIcon(attribute, 'attributes') ? { backgroundImage: 'url(' + fetchIcon(attribute, 'attributes') + ')'} : false"></span> 
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
import Toolkit from '../mixins/toolkit'
import Stats from '../mixins/stats'

export default {
  name: 'Ranking',
  mixins: [Toolkit, Stats],
  data () {
    return {
      compact: false,
      params: {
        lv60ready: false,
        baseOnly: true,
        addAwakening: true,
        addWeapon: true,
        addArmor: true,
        addPassives: true,
        addFourStar: false,
        addSynergy: false,
        addArtifact: false
      },
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
          field: 'name',
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
    listCharacters: function () {
      if (this.params.lv60ready) {
        return this.characters.filter(function (character) { return character.lv60 !== false })
      }
      return this.characters.filter(function (character) { return character.placeholder !== true })
    },
    isFinished: function (row) {
      if (row.exclusiveWeapon === undefined) {
        return 'exclusiveMissing'
      }
      return 'hasExclusive'
    }
  },
  created () {
    this.characters = this.fetchCharacters()
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
ul.notes {
  color: #ccc;
  margin: 0 auto;
  max-width: 610px;
  list-style: none;
  font-size: 0.85em;
  margin: 15px auto;
  padding: 15px 25px;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
}

li {
  margin: 2.5px auto;
}

div.ranking-options {
  display: block;
}

input[type=checkbox], input[type=radio] {
  width: 16px;
  height: 16px;
  margin: 0 7.5px;
  vertical-align: middle;
}

.additional-options tr, .base-checkbox, .ranking-level {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5px;
  font-family: 'Open Sans', sans-serif;
  text-align: center;
}

.additional-options {
  max-width: 480px;
  margin: 0 auto;
}

.additional-options td:nth-child(2) {
  text-align: left;
}

.additional-options td:first-child {
  text-align: right;
}

/* Ranking Table styles */

.ranking-table {
  width: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 0.875em;
  margin: 0 auto;
}

.ranking-table thead {
  background-color: #43517a;
}

.ranking-table th, .ranking-table th.sorting-asc, .ranking-table th.sorting-desc {
  padding: 10px;
  color: #ccc !important;
  font-size: 10px;
  width: 10.625% !important;
  cursor: pointer;
}

.ranking-table th:first-child {
  width: 15% !important;
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
  font-size: 1.2em;
}

.ranking-table tbody {
  font-family: 'Open Sans', sans-serif;
  background-color: #bdbdbd;
  box-shadow: inset 0px 10px 14px -10px #273153,  inset 0px -10px 14px -10px #273153;
}

.ranking-table tbody tr {
  box-shadow: inset -10px 0px 14px -10px #273153,  inset 10px 0px 14px -10px #273153;
  height: 32px;
}

.ranking-table tbody tr:nth-child(2n) {  
  background-color: #acacac;
}

.ranking-table td {
  color: #212121;
  padding: 5px 5px;
  width: 100px;
}

.ranking-table td.character {
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
  margin-top: 2px;
  cursor: pointer;
}

.ranking-table div.empty {
  font-size: 1.15em;
  padding: 10px 0;
  padding-top: 7px;
}

.ranking-table td.attributes span {
  display: inline-block;
  vertical-align: middle;
  background-size: contain;
  margin: 0 3px;
}

.ranking-table td.attributes span.big {
  width: 25px;
  height: 25px;
}

.ranking-table td.attributes span.small {
  width: 20px;
  height: 20px;
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
  max-width: 310px;
  padding: 0.9em 1em;
  background-color: #bdbdbd;
  color: #212121;
  border-style: none;
  border-radius: 3px;
  box-shadow: inset 0 0 10px #273153;
  margin: 15px auto;
  margin-top: 5px;
  font-family: 'Open Sans', sans-serif;
}

input[type=text]::placeholder {
  color: #212121;
  font-size: 1em;
}

label {
  font-size: 0.875em;
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
  .ranking-table tr th:nth-child(9), .ranking-table tr td:nth-child(9) {
    display: none;
  }
}

@media screen and (max-width: 560px) {
  .ranking-table tr th:nth-child(3), .ranking-table tr td:nth-child(3) {
    display: none;
  }
}

@media screen and (max-width: 480px) {

  .ranking-table th span {
    font-size: 10px;
  }

  .ranking-table th.sorting-asc:after, .ranking-table th.sorting-desc:after {
    margin: 5px 4px !important;
    border-width: 4px !important;
  }
  
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
