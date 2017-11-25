<template>
  <div class="character">
    <h2 class="header">{{ character.name }}</h2>
    <router-link :to="{ name: 'character', params: { slug: previousCharacter }}">Previous</router-link>
    <div class="status">
      <div class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></div>
      <div class="gear">
      </div>
    </div>
    <router-link :to="{ name: 'character', params: { slug: nextCharacter }}">Next</router-link>
  </div>
</template>

<script>
import Toolkit from '../mixins/toolkit'

export default {
  name: 'Character',
  mixins: [Toolkit],
  data () {
    return {
      character: {}
    }
  },
  methods: {
    loadCharacter: function () {
      let name = this.$route.params.slug
      return this.fetchCharacters()
      .find(function (a) { return a.name.toLowerCase().split(' ').join('_').split('\'').join('') === name }, name)
    }
  },
  created () {
    this.character = this.loadCharacter()
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
    }
  }
}
</script>

<style scoped>

div.status {
  margin: 0 auto;
  max-width: 600px;
  display: flex;
}

div.gear  {
  margin: 0;
  color: #ccc;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
  display: inline-block;
  width: calc(100% - 160px);
  height: 160px;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
}

div.icon {
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0;
  width: 160px;
  height: 160px;
  display: inline-block;
  border-radius: 3px;
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  box-shadow: inset 0 0 10px #273153;
}
</style>
