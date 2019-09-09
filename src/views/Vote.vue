<template>
  <div>
    <GameCard v-for="game in gameLibrary" :key="game.appid" :game="game" />
  </div>
</template>

<script>
import GameCard from '../components/GameCard'

export default {
  components: {
    GameCard
  },

  computed: {
    gameLibrary() {
      return this.$store.getters.gameLibrary
    }
  }
}
</script>

<style lang="scss" scoped>
</style>