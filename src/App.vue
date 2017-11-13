<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png">
    <Ranking/>
  </div>
</template>

<script>
import Ranking from './components/Ranking'

export default {
  name: 'app',
  components: {
    Ranking
  }
}
</script>

<style>
body {
  background-color: #0b0b0b;
  background-image: url('./assets/bg_under_repeat.jpg');
  background-repeat: repeat-y;
  background-position: top center;
  background-size: cover;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #cfd8dc;
}

.logo {
  max-width: 514px;
  width: 100%;
}
</style>
