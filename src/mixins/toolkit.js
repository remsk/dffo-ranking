export default {
  methods: {
    slugify: function (str) {
      return str.toLowerCase().split(' ').join('_').split('\'').join('')
    },
    fetchCharacters: function () {
      try {
        return require('../db.json')
      } catch (e) {
        console.log('Unable to load database.')
      }
    },
    fetchFilters: function () {
      try {
        return require('../filters.json')
      } catch (e) {
        console.log('Unable to load filters.')
      }
    },
    fetchPatterns: function () {
      try {
        return require('../patterns.json')
      } catch (e) {
        console.log('Unable to load patterns.')
      }
    },
    fetchIcon: function (name, type) {
      let slug = this.slugify(name)
      try {
        return require('../assets/icons/' + type + '/' + slug + '.png')
      } catch (e) {
        return false
      }
    },
    fetchCard: function (name) {
      let slug = this.slugify(name)
      try {
        return require('../assets/cards/' + slug + '.jpg')
      } catch (e) {
        return false
      }
    },
    openCharacterPage: function (name) {
      let slug = this.slugify(name)

      this.$router.push({name: 'character', params: { slug }})
    }
  }
}
