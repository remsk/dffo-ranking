<template>
  <div class="characters">
    <h2 class="header">ALL CHARACTERS</h2>
    <ul>
      <li v-for="character in characters" @click="openCharacterPage(character.name)">
        <span class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></span>
        <span class="name">{{ character.name }}</span>
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
      characters: []
    }
  },
  created () {
    this.characters = this.fetchCharacters()
    .map(function (character) { return { id: character.id, name: character.name } })
    .sort(function (a, b) { return a.id - b.id })
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0 auto;
  padding: 10px 0;
  color: #ccc;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
  text-align: center;
  max-width: 860px;
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
  box-shadow: inset 0 0 10px #273153;
  border-radius: 3px;
}
span.name {
  font-size: 0.85em;
  color: #212121;
  width: 120px;
  height: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  background-color: #bdbdbd;
  border-radius: 3px;
  box-shadow: inset 0 0 10px #273153;
}
</style>
