<template>
  <div class="has-text-centered">
    <h1 class="stats-header">Steam Quest</h1>
    <div v-if="configComplete" class="no-config">
      <div class="currently-playing">
        <p>Currently Playing:</p>
        <p>{{ currentGameName }}</p>
      </div>
      <div class="current-round">
        <h3>Top games</h3>
        <div v-for="(game, index) of stats.topGames" :key="index">
          <p>{{ game.name }}</p>
          <p class="subtitle">{{ game.total }} votes</p>
        </div>
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
        return this.stats.current && this.stats.current.name
          ? this.stats.current.name
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

  .subtitle {
    font-size: 14px;
  }
</style>