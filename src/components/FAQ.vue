<template>
  <div class="faq">
  	<ul>
      <li class="question">dsds</li>
      <li class="answer">dsds</li>
  	</ul>
  </div>
</template>

<script>
export default {
  name: 'FAQ',
  data () {
    return {}
  }
}
</script>

<style scoped>

ul {
  list-style: none;
  margin: 0 auto;
  padding: 10px;
}

li {
  display: block;
}

li.question {
  text-transform: uppercase;
}

li.answer {
  color: #ccc;
  padding: 10px;
  border-radius: 3px;
  background-color: #273153;
  box-shadow: inset 0 0 10px #000000;
}
</style>
