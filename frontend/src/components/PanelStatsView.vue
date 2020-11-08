<template>
  <div class="has-text-centered">
    <h1 class="stats-header">Steam Quest</h1>
    <div class="currently-playing">
      <p>Currently Playing:</p>
      <p>{{ currentGameName }}</p>
    </div>
    <div class="current-round">
      <h3>Current Voting Round</h3>
      <p>Top 3 games</p>
      <p>Game 1: 50 votes</p>
      <p>Game 2: 30 votes</p>
      <p>Game 3: 10 votes</p>
    </div>
    <div>
      <b-button type="is-primary" @click="emitVoteClicked">Vote For A Game</b-button>
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
  .stats-header {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .currently-playing {
    margin-bottom: 40px;
  }

  .current-round {
    margin-bottom: 20px;
  }

  .current-round h3 {
    font-size: 20px;
    font-weight: 600;
  }
</style>