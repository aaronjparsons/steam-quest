<template>
  <div class="container">
    <PanelStatsView
      v-if="currentView === 'stats'"
      :stats="panelStats"
      @voteClicked="goToListsView"
    />
    <PanelListsView
      v-else-if="currentView === 'vote'"
      :library="library"
      :completed="completed"
      @backClicked="goToStatsView"
    />
    <div v-else>
      {{ selectedGame.name }}
    </div>
  </div>
</template>

<script>
import createAxios from '../modules/axios'
import PanelStatsView from '../components/PanelStatsView'
import PanelListsView from '../components/PanelListsView'

export default {
  components: {
    PanelStatsView,
    PanelListsView
  },

  data() {
    return {
      channedId: null,
      currentView: 'stats',
      panelStats: {},
      libraryLoading: false,
      library: [],
      completed: [],
      selectedGame: null
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
    goToListsView() {
      this.currentView = 'vote'
      this.getLibrary()
    },

    goToStatsView() {
      this.currentView = 'stats'
    },

    moveToVote(item) {
      this.selectedGame = item
      this.currentView = 'gameVote'
    },

    async getChannel(id) {
      try {
        const data = await this.axios.get(`/channels/${id}/panelstats`)
        console.log(data.data)
        this.panelStats = data.data
      } catch (error) {
        console.log(error)
      }
    },

    async getLibrary() {
      this.libraryLoading = true
      try {
        const library = await this.axios.get(`/channels/${this.panelStats.channelId}/library`)

        this.library = library.data.library
        this.completed = library.data.completed
        console.log(library.data)
      } catch (error) {
        console.log(error)
      }
      this.libraryLoading = false
    }
  }
}
</script>

<style scoped>

</style>