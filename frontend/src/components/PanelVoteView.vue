<template>
  <div>
    <b-button type="is-text" icon-left="chevron-left" @click="emitBackClicked">Back</b-button>
    <div class="has-text-centered">
      <img :src="`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`" alt="Game Logo">
      <h2 class="subtitle">{{ game.name }}</h2>
      <p>Current vote total: {{ game.totalVotes }}</p>
      <b-button type="is-primary" @click="emitSubmitVote">Submit Vote</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  },

  methods: {
    emitBackClicked() {
      this.$emit('backClicked')
    },

    emitSubmitVote() {
      this.$emit('submitVote', {
        appid: this.game.appid,
        votes: 1
      })
    }
  }
}
</script>

<style scoped>

</style>