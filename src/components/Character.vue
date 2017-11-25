<template>
  <div class="character">
    <h2 class="header">{{ character.name }}</h2>
    <div class="status">
      <div class="icon" :style="fetchCard(character.name) ? { backgroundImage: 'url(' + fetchCard(character.name) + ')'} : false"></div>
      <div class="gear">
      </div>
    </div>
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
  created () {
    let name = this.$route.params.slug
    this.character = this.fetchCharacters()
    .find(function (a) {
      return a.name.toLowerCase().split(' ').join('_').split('\'').join('') === name
    }, name)
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
