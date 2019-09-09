<template>
  <router-view></router-view>
</template>

<script>
export default {
  created() {
    if (!this.$store.getters.gameLibrary.length) {
      this.$store.dispatch('setGameLibrary')
    }
  }
}
</script>

<style></style>
