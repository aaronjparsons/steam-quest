<template>
  <div class="container has-text-centered">
    <div v-if="currentView === 'stats'">
      <div>
        <p>Current Game</p>
        <p>Started: Date</p>
      </div>
      <div>
        <p>Top 3 games</p>
        <p>Game 1: 50 votes</p>
        <p>Game 2: 30 votes</p>
        <p>Game 3: 10 votes</p>
      </div>
      <div>
        <b-button type="is-primary" @click="currentView = 'vote'">Vote</b-button>
      </div>
    </div>
    <div v-else>
      <p>Games list:</p>
    </div>
  </div>
</template>

<script>
import createAxios from '../modules/axios'

export default {
  data() {
    return {
      currentView: 'stats'
    }
  },

  mounted() {
    window.Twitch.ext.onAuthorized(async (auth) => {
      console.log('auth: ', auth)
      this.axios = createAxios(auth.token)
      await this.getChannel(auth.channelId)
    })

    window.Twitch.ext.onContext(context => {
      window.Twitch.ext.rig.log('context: ', context)
    })

    console.log('Bits Enabled?: ', window.Twitch.ext.features.isBitsEnabled)
  },

  methods: {
    async getChannel(id) {
      try {
        const data = await this.axios.get(`/channels/${id}/channel`)

        console.log(data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>