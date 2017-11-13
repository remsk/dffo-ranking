<template>
  <div class="ranking">
    <vue-good-table
      :columns="columns"
      :rows="characters"
      :globalSearch="true"
      :lineNumbers="false"
      :defaultSortBy="{field: 'id', type: 'asc'}"
      globalSearchPlaceholder="Search by character, attribute or stat"
      styleClass="ranking-table">
      <template slot="table-row" slot-scope="props">
        <td class="character">
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
      minMaxValues: {
        HP: [3656, 4468],
        initialBRV: [646, 831],
        maxBRV: [1227, 1500],
        ATK: [452, 509],
        DEF: [367, 594]
      },
      columns: [
        {
          label: 'Order',
          field: 'id',
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
          sortable: true
        },
        {
          label: 'Initial BRV',
          field: 'initialBRV',
          type: 'number',
          filterable: true,
          sortable: true
        },
        {
          label: 'Max BRV',
          field: 'maxBRV',
          type: 'number',
          filterable: true,
          sortable: true
        },
        {
          label: 'ATK',
          field: 'ATK',
          type: 'number',
          filterable: true,
          sortable: true
        },
        {
          label: 'DEF',
          field: 'DEF',
          type: 'number',
          filterable: true,
          sortable: true
        }
        // {
        //   label: 'BST',
        //   field: 'baseStatsTotal',
        //   type: 'number',
        //   filterable: true
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
      return row.HP + row.initialBRV + row.maxBRV + row.ATK + row.DEF
    },
    characterIcon: function (character) {
      let slug = character.toLowerCase().split(' ').join('_').split('\'').join('')
      if (require('../assets/icons/' + slug + '.png') !== undefined) {
        return require('../assets/icons/' + slug + '.png')
      } else {
        return null
      }
    }
  },
  created () {
    this.setCharactersTable()
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

.ranking-table td.character {
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

input {
  display: block;
  width: 50% !important;
  flex: 1;
  padding: 0.6em 1em;
  background-color: #273153;
  color: #ccc;
  border-style: none;
  border-radius: 5px;
  box-shadow: inset 0 0 10px #000000;
  margin: 0 auto;
  margin-bottom: 15px;
}

input::placeholder {
  color: #ccc;
}

.highest {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}

/*.highest:after {
  content: '1st';
  font-size: 10px;
  color: #212121;
  position: absolute;
}*/

.lowest {
  color: #303f9f;
  font-weight: bold;
  font-size: 12px;
}

/*.lowest:after {
  content: 'last';
  font-size: 10px;
  color: #212121;
  position: absolute;
}*/

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
