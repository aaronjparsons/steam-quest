<template>
  <div class="has-text-centered">
    <h1 class="stats-header">Steam Quest</h1>
    <div v-if="configComplete" class="no-config">
      <div class="currently-playing">
        <p>Currently Playing:</p>
        <p>{{ currentGameName }}</p>
      </div>
      <div class="current-round">
        <h3>Current Voting Round</h3>
        <p>Top games</p>
        <p v-for="(game, index) of stats.topGames" :key="index">
          {{ game.appid }}: {{ game.total }} votes
        </p>
      </div>
      <div>
        <b-button type="is-primary" @click="emitVoteClicked">Vote For A Game</b-button>
      </div>
    </div>
    <div v-else>
      <p>This broadcaster has not completed the configuration for Steam Quest</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      stats: {
        type: Object,
        required: true
      },
      configComplete: {
        type: Boolean,
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

  .no-config {
    padding: 10px;
    text-align: center;
    font-size: 20px;
  }
</style>