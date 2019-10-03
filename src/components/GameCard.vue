<template>
  <div class="game-card">{{ game.name }}</div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.game-card {
  background: #1f2833;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>