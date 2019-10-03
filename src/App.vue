<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    // If the gameLibrary is empty, dispatch the action to set the gameLibrary
    if (!this.$store.getters.gameLibrary.length) {
      this.$store.dispatch('setGameLibrary')
    }
  }
}
</script>

<style lang="scss">
/*
Background: #0B0C10
Main Color: #1f2833
Light Grey: #C5C6C7
Blue Green: #66FCF1
Blue Grey:  #45A29E
*/
</style>
