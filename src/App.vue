<template>
  <router-view></router-view>
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

<style></style>
