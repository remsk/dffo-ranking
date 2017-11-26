<template>
  <div class="characters">
    <h2 class="header">ALL CHARACTERS</h2>
    <ul>
      <li v-for="character in charactersList" @click="openCharacterPage(character.name)">
        <span class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></span>
        <span class="name">{{ character.name }}</span>
        <span class="info">{{ filterByCharacter(character) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Toolkit from '../mixins/toolkit'

export default {
  name: 'Characters',
  mixins: [Toolkit],
  data () {
    return {
      characters: [],
      filters: {}
    }
  },
  methods: {
    filterByCharacter: function (character) {
      return this.filters.series.find(function (entry) { return entry.id === character.series }).name
    },
    sortBy: function () {
      return this.characters.sort(function (a, b) { return a.id - b.id })
    }
  },
  created () {
    this.characters = this.fetchCharacters()
    .map(function (character) {
      return {
        id: character.id,
        name: character.name,
        series: character.series
      }
    })
    this.filters = this.fetchFilters()
  },
  computed: {
    charactersList: function () {
      return this.sortBy()
    }
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
  filter: none;
  transition: .25s all;
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

span.name, span.info {
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

span.info {
  display: none;
}

li:hover {
  filter: grayscale(75%);
}

li:hover span.name {
  display: none;
}

li:hover span.info {
  display: block;
}
</style>
