<template>
  <div v-if="dataLoading" class="container">
    Loading
  </div>
  <div v-else class="container">
    <transition-group :name="transition">
      <PanelStatsView
        v-if="currentView === 'stats'"
        key="stats"
        :stats="channelData.stats"
        :config-complete="configComplete"
        @voteClicked="goToListsView"
        @refreshClicked="getChannelData"
      />
      <PanelListsView
        v-else-if="currentView === 'vote'"
        key="vote"
        :library="channelData.library"
        :completed="channelData.completed"
        :current-game="channelData.stats.current"
        @backClicked="goToStatsView"
        @gameVoteSelected="goToGameVoteView"
      />
      <PanelVoteView
        v-else
        key="gameVote"
        :game="selectedGame"
        :axios="axios"
        :channelId="channelId"
        @backClicked="goToListsView"
        @voteComplete="goToStatsView"
      />
    </transition-group>
  </div>
</template>

<script>
import createAxios from '../modules/axios'
import PanelStatsView from '../components/PanelStatsView'
import PanelListsView from '../components/PanelListsView'
import PanelVoteView from '../components/PanelVoteView'


export default {
  components: {
    PanelStatsView,
    PanelListsView,
    PanelVoteView
  },

  data() {
    return {
      axios: null,
      transition: 'slide-prev',
      channelId: null,
      currentView: 'stats',
      channelData: {},
      libraryLoading: false,
      // library: [],
      // completed: [],
      selectedGame: null,
      configComplete: true, // TODO: This should be a boolean from the BE
      dataLoading: true,
      voteLoading: false
    }
  },

  mounted() {
    window.Twitch.ext.onAuthorized(async (auth) => {
      console.log('auth: ', auth)
      this.axios = createAxios(auth.token, auth.channelId)
      this.channelId = auth.channelId;
      await this.getChannelData()
    })

    window.Twitch.ext.onContext(context => {
      window.Twitch.ext.rig.log('context: ', context)
    })

    console.log('Bits Enabled?: ', window.Twitch.ext.features.isBitsEnabled)
  },

  methods: {
    goToListsView() {
      this.transition = 'slide-prev'
      if (this.selectedGame) {
        this.transition = 'slide-next'
        this.selectedGame = null
      }
      this.currentView = 'vote'
      // this.getLibrary()
    },

    goToStatsView() {
      this.transition = 'slide-next'
      this.currentView = 'stats'
    },

    goToGameVoteView(game) {
      this.transition = 'slide-prev'
      this.selectedGame = game
      this.currentView = 'gameVote'
    },

    async getChannelData() {
      this.dataLoading = true;
      try {
        const data = await this.axios.get(`/channels/${this.channelId}/panelstats`)
        this.channelData = data.data
      } catch (error) {
        if (error.response.status === 404) {
          this.configComplete = false;
        }
        console.log(error)
      }
      this.dataLoading = false
    },

    // async getLibrary() {
    //   this.libraryLoading = true
    //   try {
    //     const library = await this.axios.get(`/channels/${this.channelId}/library`)

    //     this.library = library.data.library
    //     this.completed = library.data.completed
    //     console.log(library.data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    //   this.libraryLoading = false
    // },
  }
}
</script>

<style scoped>

</style>