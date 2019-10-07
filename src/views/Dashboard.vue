<template>
  <div class="container">Dashboard</div>
</template>

<script>
export default {
  created() {
    // If the gameLibrary is empty, dispatch the action to set the gameLibrary
    if (!this.$store.getters.gameLibrary.length) {
      this.$store.dispatch('setGameLibrary')
    }

    // If the top 5 is empty, dispatch the action to set the top 5
    if (!this.$store.getters.topVotes.length) {
      this.$store.dispatch('setTopVotes')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>