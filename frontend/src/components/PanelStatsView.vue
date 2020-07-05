<template>
  <div class="has-text-centered">
    <div>
      <p>Currently Playing:</p>
      <p>{{ currentGameName }}</p>
      <p>Started: Date</p>
    </div>
    <div>
      <p>Top 3 games</p>
      <p>Game 1: 50 votes</p>
      <p>Game 2: 30 votes</p>
      <p>Game 3: 10 votes</p>
    </div>
    <div>
      <b-button type="is-primary" @click="emitVoteClicked">Vote</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      stats: {
        type: Object,
        required: true
      }
    },

    computed: {
    currentGameName() {
      return this.stats.currentGame && this.stats.currentGame.name
        ? this.stats.currentGame.name
        : 'No Active Game Set'
      }
    },

    methods: {
      emitVoteClicked() {
        this.$emit('voteClicked')
      }
    }
  }
</script>

<style scoped>

</style>