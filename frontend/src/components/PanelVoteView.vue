<template>
  <div>
    <b-button type="is-text" icon-left="chevron-left" @click="emitBackClicked">Back</b-button>
    <div class="has-text-centered">
      <img :src="`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`" alt="Game Logo">
      <h2 class="subtitle">{{ game.name }}</h2>
      <p>Current vote total: {{ game.totalVotes }}</p>
      <b-button
        type="is-primary"
        :loading="voteLoading"
        @click="submitVote"
      >
        Submit Vote
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    },
    channelId: {
      type: String,
      required: true
    },
    axios: {
      type: Function,
      required: false
    }
  },

  data() {
    return {
      voteLoading: false
    }
  },

  methods: {
    emitBackClicked() {
      this.$emit('backClicked')
    },

    emitVoteComplete(data) {
      this.$emit('voteComplete', data)
    },

    async submitVote() {
      this.voteLoading = true;
      try {
        const voteData = {
          appid: this.game.appid,
          votes: 1
        }
        const response = await this.axios.post(`/channels/${this.channelId}/vote`, voteData);
        this.$buefy.toast.open({
          message: `Your vote has been cast!`,
          position: 'is-bottom',
          type: 'is-success'
        })
        this.emitVoteComplete(response.data);
      } catch (error) {
        this.$buefy.toast.open({
          message: `${error}`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
      this.voteLoading = false;
    }
  }
}
</script>

<style scoped>

</style>