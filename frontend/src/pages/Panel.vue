<template>
  <div class="container">
    <transition-group :name="transition">
      <PanelStatsView
        v-if="currentView === 'stats'"
        key="stats"
        :stats="panelStats"
        @voteClicked="goToListsView"
      />
      <PanelListsView
        v-else-if="currentView === 'vote'"
        key="vote"
        :library="library"
        :completed="completed"
        @backClicked="goToStatsView"
        @gameVoteSelected="goToGameVoteView"
      />
      <PanelVoteView
        v-else
        key="gameVote"
        :game="selectedGame"
        @backClicked="goToListsView"
        @submitVote="submitVote"
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
      this.axios = createAxios(auth.token, auth.channelId)
      await this.getChannel()
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
      this.getLibrary()
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

    async getChannel() {
      try {
        const data = await this.axios.get('/panelstats')
        console.log(data.data)
        this.panelStats = data.data
      } catch (error) {
        console.log(error)
      }
    },

    async getLibrary() {
      this.libraryLoading = true
      try {
        const library = await this.axios.get('/library')

        this.library = library.data.library
        this.completed = library.data.completed
        console.log(library.data)
      } catch (error) {
        console.log(error)
      }
      this.libraryLoading = false
    },

    async submitVote() {
      try {
        await this.axios.post('/vote', {})
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>

</style>