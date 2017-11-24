<template>
  <div id="app">
    <header>
       <router-link :to="{ name: 'ranking' }" class="logo">
        <img title="DFF OPERA OMNIA" src="./images/logo.png">
      </router-link>
      <navigation />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>All materials are the property of KOEI TECMO GAMES/SQUARE ENIX CO., LTD. All Rights Reserved.</footer>
  </div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
  name: 'app',
  components: {
    Navigation
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Karla|Open+Sans');

*:focus {
  outline: none;
}

label, th, nav {
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */    
}

body {
  background-color: #0b0b0b;
  background-image: url('./images/bg.jpg');
  background-repeat: repeat-y;
  background-position: top center;
  color: #cfd8dc;
  margin: 0;
  padding: 0 10px;
}

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  max-width: 910px;
  background-color: #43517a;
  margin: 0 auto;
  padding: 15px;
  box-shadow: inset 0 0 10px #000000;
  border-radius: 3px;
  border-right: 1px solid #3b3b3b;
  border-bottom: 1px solid #3b3b3b;
  border-left: 1px solid #5b5b5b;
  border-top: 1px solid #5b5b5b;
}

 h2 {
  font-family: 'Karla', sans-serif;
  text-transform: uppercase;
  font-size: 1.5em;
  text-align: center;
  margin-top: 10px;
}

header {
  margin: 15px auto;
}

a.logo {
  margin: 0 auto;
  display: block;
  max-width: 430px;
  line-height: 0;
}

a.logo img {
  width: 100%;
}

footer {
  max-width: 910px;
  font-size: 0.75em;
  padding: 5px 15px;
  margin: 0 auto;
  text-align: center;
}

@media screen and (min-width: 1800px) {
  body {
    background-size: cover;
  }
}
</style>
