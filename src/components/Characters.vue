<template>
  <div class="characters">
    <h2 class="header">ALL CHARACTERS</h2>
    <div class="series">
      <ul>
        <li v-for="character in sortBySeries()" @click="openCharacterPage(character.name)">
          <span class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></span>
          <span class="name">{{ character.name }}</span>
          <span class="series">{{ filterByCharacter(character).name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Toolkit from '../mixins/toolkit'

export default {
  name: 'Characters',
  mixins: [Toolkit],
  data () {
    return {
      orderBySeries: false,
      characters: [],
      series: []
    }
  },
  methods: {
    filterByCharacter: function (character) {
      return this.series.find(function (entry) { return entry.id === character.series })
    },
    sortBySeries: function () {
      if (this.orderBySeries) {
        return this.characters.sort(function (a, b) {
          if (a.series === b.series) {
            return a.id - b.id
          }
          return a.series - b.series
        })
      }
      return this.characters.sort(function (a, b) { return a.id - b.id })
    }
  },
  created () {
    this.characters = this.fetchCharacters()
    .map(function (character) { return { id: character.id, name: character.name, series: character.series.id } })
    this.series = this.fetchSeries()
  }
}
</script>

<style scoped>

ul {
  list-style: none;
  padding: 10px;
  margin: 0;
  color: #ccc;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
  text-align: center;
}

li {
  width: 120px;
  height: 140px;
  display: inline-block;
  vertical-align: top;
  margin: 10px;
  cursor: pointer;
}

span.icon {
  background-size: contain;
  background-repeat: no-repeat;
  width: 120px;
  height: 120px;
  display: block;
  margin: 0 auto;
  border-radius: 3px;
  border-bottom-right-radius: unset;
  border-bottom-left-radius: unset;
}

span.name, span.series {
  font-size: 0.65em;
  line-height: 20px;
  text-transform: uppercase;
  color: #212121;
  width: 120px;
  height: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  background-color: #bdbdbd;
  border-radius: 3px;
  box-shadow: inset 0 0 10px #273153;
  border-top-right-radius: unset;
  border-top-left-radius: unset;
}

span.series {
  display: none;
}

li:hover span.name {
  display: none;
}

li:hover span.series {
  display: block;
}
</style>
