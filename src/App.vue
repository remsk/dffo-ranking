<template>
  <div id="app">
    <router-link :to="{ name: 'Ranking' }">
      <header class="logo"><img title="DFF OPERA OMNIA" src="./images/logo.png"></header>
    </router-link>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <footer>All materials are the property of KOEI TECMO GAMES/SQUARE ENIX CO., LTD. All Rights Reserved. </footer>
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

header.logo {
  display: block;
  margin: 15px auto;
  max-width: 430px;
  line-height: 0;
}

header.logo img {
  width: 100%;
}

footer {
  font-size: 12px;
  padding: 5px 15px;
}

@media screen and (min-width: 1800px) {
  body {
    background-size: cover;
  }
}
</style>
