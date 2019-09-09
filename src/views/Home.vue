<template>
  <div>
    Home
    <div>
      <p v-for="game in gameLibrary" :key="game.appid">{{ game.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    gameLibrary() {
      return this.$store.getters.gameLibrary
    }
  }
}
</script>

<style lang="scss" scoped>
</style>