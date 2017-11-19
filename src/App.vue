<template>
  <div id="app">
    <a href="/" class="logo"><img title="DFF OPERA OMNIA" src="./images/logo.png"></a>
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
  background-image: url('./images/bg.jpg');
  background-repeat: repeat-y;
  background-position: top center;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #cfd8dc;
}

a.logo {
  display: block;
  margin: 15px auto;
  max-width: 430px;
  line-height: 0;
}

a.logo img {
  width: 100%;
}

@media screen and (min-width: 1800px) {
  body {
    background-size: cover;
  }
}
</style>
