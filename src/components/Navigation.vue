<template>
  <nav>
    <ul>
      <li :class="isActive('ranking') ? 'active' : false"><router-link :to="{ name: 'ranking' }">Ranking</router-link></li>
      <li :class="isActive('characters') ? 'active' : false"><router-link :to="{ name: 'characters' }">Characters</router-link></li>
      <li :class="isActive('faq') ? 'active' : false"><router-link :to="{ name: 'faq' }">FAQ</router-link></li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'navbar',
  methods: {
    isActive: function (route) {
      if (this.$route.name === route) {
        return true
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

nav {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  font-size: 12px;
}

ul {
  background-color: #43517a;
  list-style-type: none;
  display: table;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  border-radius: 3px;
  border-right: 1px solid #3b3b3b;
  border-bottom: 1px solid #3b3b3b;
  border-left: 1px solid #5b5b5b;
  border-top: 1px solid #5b5b5b;
  box-shadow: inset 0 0 10px #000000;
}

li {
  margin:0;
  height: calc(100% - 20px);
  vertical-align: middle;
  display: table-cell;
}

.active {
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
}

a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.25em;
  line-height: 1.25em;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: block;
  margin: 0 auto;
}

@media screen and (max-width: 620px) {
  li {
    font-size: 0.85em;
  }
}
</style>
