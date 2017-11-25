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
    fetchSeries: function () {
      try {
        return require('../series.json')
      } catch (e) {
        console.log('Unable to load series.')
      }
    },
    fetchIcon: function (name, type) {
      let slug = this.slugify(name)
      try {
        return require('../images/icons/' + type + '/' + slug + '.png')
      } catch (e) {
        return false
      }
    },
    fetchCard: function (name) {
      let slug = this.slugify(name)
      try {
        return require('../images/cards/' + slug + '.jpg')
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
