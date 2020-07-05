<template>
  <div class="container">
    <div v-if="currentView === 'stats'" class="has-text-centered">
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
        <b-button type="is-primary" @click="changePanelView">Vote</b-button>
      </div>
    </div>
    <div v-else>
      <b-button type="is-text" icon-left="chevron-left" @click="currentView = 'stats'">Back</b-button>
      <b-tabs v-model="activeTab" position="is-centered">
        <b-tab-item label="Vote List">
          <b-input
            v-model="searchQuery"
            class="search-input"
            placeholder="Search for a game..."
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="searchQuery = ''"
          ></b-input>
          <b-collapse
            class="card"
            animation="slide"
            v-for="(item, index) of filteredLibrary.slice(0, this.numberOfItems)"
            :key="index"
            :open="voteListOpen === index"
            @open="voteListOpen = index"
          >
            <div
              slot="trigger"
              slot-scope="props"
              class="card-header"
              role="button"
            >
              <p class="card-header-title-p">
                {{ item.name }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
              </a>
            </div>
            <CardContent v-if="voteListOpen === index" :item="item" />
          </b-collapse>
        </b-tab-item>
        <b-tab-item label="Completed">
          <b-collapse
            class="card"
            animation="slide"
            v-for="(item, index) of completed"
            :key="index"
            :open="completedListOpen === index"
            @open="completedListOpen = index"
          >
            <div
              slot="trigger"
              slot-scope="props"
              class="card-header"
              role="button"
            >
              <p class="card-header-title-p">
                {{ item.name }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
              </a>
            </div>
            <CardContent v-if="completedListOpen === index" :item="item" completed />
          </b-collapse>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import createAxios from '../modules/axios'
import CardContent from '../components/CardContent'

export default {
  components: {
    CardContent
  },

  data() {
    return {
      activeTab: 0,
      channedId: null,
      currentView: 'stats',
      panelStats: {},
      libraryLoading: false,
      library: [],
      completed: [],
      voteListOpen: null,
      completedListOpen: null,
      selected: null,
      searchQuery: '',
      debouncedSearchQuery: '',
      numberOfItems: 15
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

    this.scroll()
  },

  computed: {
    currentGameName() {
      return this.panelStats.currentGame && this.panelStats.currentGame.name
        ? this.panelStats.currentGame.name
        : 'No Active Game Set'
    },
    filteredLibrary() {
      return this.library.filter(item => {
        return item.name.toLowerCase().includes(this.debouncedSearchQuery.toLowerCase())
      })
    }
  },

  watch: {
    searchQuery: function() {
      this.debouncer()
    },
    debouncedSearchQuery: function() {
      this.numberOfItems = 15
    }
  },

  methods: {
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.numberOfItems += 15
        }
      }
    },

    debouncer: debounce(function(){
      this.debouncedSearchQuery = this.searchQuery
    },500),

    changePanelView() {
      if (this.currentView === 'stats') {
        this.currentView = 'vote'
        this.getLibrary()
      } else if (this.currentView === 'vote') {
        this.currentView = 'stats'
      }
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
.card-header-title-p {
  text-align: left;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  overflow : hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1
}
.card-header-icon {
  padding: 0.25rem 0.75rem;
}

.search-input {
  margin-bottom: 0.75rem;
}
</style>