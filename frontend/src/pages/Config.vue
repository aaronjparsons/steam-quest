<template>
  <div class="container">
    <h3>Steam Quest Configuration</h3>
    <div class="section">
      <div v-if="channelRequestLoading" class="section">
        <b-loading :active="true" :is-full-page="false" />
        Loading
      </div>
      <div v-else-if="channel.configComplete">
        <!-- CONFIG EDIT START -->
         <b-tabs v-model="activeTab">
          <b-tab-item label="Current Game">
            <div class="section">
              <h2 class="title is-4">{{ this.channel.current.name }}</h2>
              <p>Change the current game:</p>
              <b-field grouped>
                <b-autocomplete
                  v-model="currentGameInput"
                  placeholder="Search for a game..."
                  :data="filteredLibrary"
                  field="name"
                  expanded
                  @select="setLocalCurrent">
                </b-autocomplete>
                <p class="control">
                  <b-button
                    class="button is-primary"
                    :loading="updateCurrentLoading"
                    @click="updateCurrentGame"
                  >
                    Save
                  </b-button>
                </p>
              </b-field>
            </div>
            <div class="section">
              <h2 class="title is-4">Mark As Complete</h2>
              <div v-if="currentGameFull && currentGameFull.completed">
                <p>Mark {{ currentGameFull.name }} was completed on {{ currentGameFull.completed }}</p>
              </div>
              <div v-else>
                <p>Mark {{ this.channel.current.name }} as complete</p>
                <b-button
                  class="button is-primary"
                  :loading="updateCurrentLoading"
                  @click="completeCurrentGame"
                >
                  Mark as Complete
                </b-button>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Library">
            <b-table :data="libraryArray" striped hoverable paginated paginated-simple>
              <template slot-scope="props">
                <b-table-column field="name" label="Game">
                  {{ props.row.name }} <a :href="`https://store.steampowered.com/app/${props.row.appid}`" target="_blank"><b-icon icon="open-in-new" size="is-small"></b-icon></a>
                </b-table-column>
                <b-table-column label="Ignored" centered>
                  <b-checkbox v-model="props.row.ignored" :disabled="Boolean(props.row.completed)" type="is-danger" :native-value="props.row.appid"></b-checkbox>
                </b-table-column>
                <b-table-column label="Previously Completed" centered>
                  <b-checkbox v-model="props.row.previouslyCompleted" :disabled="Boolean(props.row.completed)" type="is-primary" :native-value="props.row.appid"></b-checkbox>
                </b-table-column>
                <b-table-column label="Completed" centered>
                  <div v-if="props.row.completed">
                    {{ props.row.completed }}
                  </div>
                </b-table-column>
              </template>
            </b-table>
          </b-tab-item>
          <b-tab-item label="Bits Settings">
            Lorem ipsum dolor sit amet.
          </b-tab-item>
        </b-tabs>
        <!-- CONFIG EDIT END -->
      </div>
      <div v-else>
        <!-- NEW CHANNEL SETUP -->
        <b-steps
          v-model="activeStep"
          animated
          rounded
        >
          <b-step-item step="1" label="Steam ID">
            <div class="section">
              <div class="new-user-info">
                <p>
                  Setting up Steam Quest is quite simple but it may take a while depending on the size of your Steam library,
                  and how much you want to customize the list of games to be voted on.
                </p>
                <p>
                  To begin configuring Steam Quest, enter your 17 digit Steam ID number (steamID64). Your Steam account must not be private,
                  otherwise your game library will not be accessible.
                  <a href="https://www.google.com/search?q=how+to+find+my+steam+id" target="_blank">Not sure where to find your Steam ID number?</a>
                </p>
              </div>
              <b-field label="Steam Profile ID">
                <b-input v-model="local.steamId" class="max-width-input" placeholder="Eg: 10483967563755997"></b-input>
              </b-field>
            </div>
          </b-step-item>

          <b-step-item step="2" label="Customize Library">
            <div class="section">
              <p>All items in your Steam library are included and will be eligible for voting by default. You may choose to mark an item as Ignored or Previously Completed if you do not want it to be eligible for voting.</p>
              <p><b-tag type="is-danger" size="is-medium">Ignored</b-tag> items will not show up in the list and can not be voted on. <b-tooltip :label="ignoredTooltip" dashed multilined>What should be marked as ignored?</b-tooltip></p>
              <p><b-tag type="is-primary" size="is-medium">Previously Completed</b-tag> games will show up in the list, but will be marked as completed and can not be voted on.</p>
              <b-table :data="libraryArray" striped hoverable paginated paginated-simple>
                <template slot-scope="props">
                  <b-table-column field="name" label="Game">
                    {{ props.row.name }} <a :href="`https://store.steampowered.com/app/${props.row.appid}`" target="_blank"><b-icon icon="open-in-new" size="is-small"></b-icon></a>
                  </b-table-column>
                  <b-table-column label="Mark as Ignored" centered>
                    <b-checkbox v-model="props.row.ignored" type="is-danger" :native-value="props.row.appid"></b-checkbox>
                  </b-table-column>
                  <b-table-column label="Mark as Previously Completed" centered>
                    <b-checkbox v-model="props.row.previouslyCompleted" type="is-primary" :native-value="props.row.appid"></b-checkbox>
                  </b-table-column>
                </template>
              </b-table>
              <p>After you have gone through your game library and marked all necessary games, you can continue with the rest of the configuration. You always come back later to edit your game library after completing the configuration.</p>
            </div>
          </b-step-item>

          <b-step-item step="3" label="Channel Options">
            <div class="section">
              <h2 class="title is-4">Setup Bits</h2>
              <h4 class="subtitle is-6">(Optional)</h4>
              <b-field :message="bitsEnableMessage" :type="channelFeatures.isBitsEnabled ? '' : 'is-danger'">
                <b-checkbox v-model="local.bitsEnabled" :disabled="!channelFeatures.isBitsEnabled">Enable bits for Steam Quest?</b-checkbox>
              </b-field>
              <b-field v-if="local.bitsEnabled" label="Bits amount per vote" :message="bitsVoteValueMessage">
                <b-numberinput v-model="local.bitsVoteValue" class="max-width-input" min="1"></b-numberinput>
              </b-field>
            </div>
            <div class="section">
              <h2 class="title is-4">Set First Game</h2>
              <h4 class="subtitle is-6">(Optional)</h4>
              <b-field :message="firstGameMessage">
                <b-autocomplete
                  v-model="currentGameInput"
                  placeholder="Search for a game..."
                  :data="filteredLibrary"
                  field="name"
                  @select="option => local.current = { appid: option.appid, name: option.name }">
                </b-autocomplete>
              </b-field>
            </div>
          </b-step-item>

          <b-step-item step="4" label="Setup Complete">
            <div class="complete has-text-centered">
              <h2 class="title is-5">Steam Quest configuration complete</h2>
              <h2 class="title is-5">Good luck and enjoy the adventure!</h2>
            </div>
          </b-step-item>

          <template
            slot="navigation"
            slot-scope="{previous, next}"
          >
            <div class="step-nav">
              <b-button
                :disabled="previous.disabled"
                @click.prevent="previous.action"
              >
                Previous
              </b-button>
              <b-button
                v-if="activeStep < 3"
                type="is-primary"
                :disabled="next.disabled"
                :loading="nextStepLoading"
                @click.prevent="nextStepAction"
              >
                Next
              </b-button>
            </div>
          </template>
        </b-steps>
        <!-- NEW CHANNEL SETUP END -->
      </div>
    </div>
  </div>
</template>

<script>
import createAxios from '../modules/axios'

export default {
  data() {
    return {
      axios: null,
      activeStep: 0,
      steamId: '',
      local: {
        steamId: '',
        current: {},
        bitsEnabled: false,
        bitsVoteValue: 20,
        configComplete: false
      },
      currentGameInput: '',
      channel: {
        library: []
      },
      channelRequestLoading: false,
      library: [],
      libraryLoading: false,
      ignoredTooltip: 'Software, videos/movies, and anything else you do not want to show up in your library list.',
      firstGameMessage: 'Already know the first game you\'ll be playing? Set it here!',
      nextStepLoading: false,
      activeTab: 0,
      updateCurrentLoading: false
    }
  },

  computed: {
    channelFeatures() {
      return window.Twitch.ext.features
    },
    bitsEnableMessage() {
      return this.channelFeatures.isBitsEnabled
        ? 'Enabling bits on this extension will allow viewers to use bits to increase their vote count.'
        : 'Your channel does not allow bits to be enabled.'
    },
    bitsVoteValueMessage() {
      return `Example: A viewer can spend ${this.local.bitsVoteValue * 5} bits to have their vote counted 5 times.`
    },
    libraryArray() {
      return Object.values(this.channel.library).sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    },
    filteredLibrary() {
      return this.libraryArray.filter(app => {
        if (app.ignored || app.previouslyCompleted) {
          return false
        } else {
          return app.name.toLowerCase().includes(this.currentGameInput.toLowerCase())
        }
      })
    },
    currentGameFull() {
      return this.channel.library[this.channel.current.appid]
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

    console.log('Features: ', this.channelFeatures)
  },

  methods: {
    async nextStepAction() {
      this.nextStepLoading = true

      switch (this.activeStep) {
        case 0:
          await this.createChannelData()

          if (this.libraryArray.length) {
            // TODO - Error handling for incorrect steam id or private account
            this.activeStep = 1
          }
          break
        case 1:
          await this.updateChannelData()
          this.activeStep = 2
          break
        case 2:
          await this.completeConfig()
          break
        default:
          break
      }

      this.nextStepLoading = false
    },

    async getChannel(id) {
      this.channelRequestLoading = true
      try {
        const response = await this.axios.get(`/channels/${id}`)

        if (response.data && response.data.configComplete) {
          this.setData(response.data)
          this.currentGameInput = this.channel.current.name
        } else {
          this.local = {
            id,
            ...this.local
          }
        }
      } catch (error) {
        console.error(error)
      }
      this.channelRequestLoading = false
    },

    async createChannelData() {
      try {
        const response = await this.axios.post('/channels', this.local)
        this.setData(response.data)
      } catch (error) {
        console.log(error)
      }
    },

    async updateChannelData() {
      try {
        await this.axios.patch(`/channels/${this.channel.id}`, this.channel)
      } catch (error) {
        console.log(error)
      }
    },

    async updateCurrentGame() {
      this.updateCurrentLoading = true
      try {
        const response = await this.axios.patch(`/channels/${this.channel.id}`, {
          current: this.local.current
        })
        this.setData(response.data)
      } catch (error) {
        console.log(error)
      }
      this.updateCurrentLoading = false
    },

    async completeConfig() {
      try {
        const data = {
          configComplete: true,
        }

        if (this.local.current.appid) {
          data.current = this.local.current;
        }

        await this.axios.patch(`/channels/${this.channel.id}`, data)
        this.activeStep = 3
        setTimeout(() => {
          this.channel.configComplete = true
        }, 5000)
      } catch (error) {
        console.log(error)
      }
    },

    setLocalCurrent(option) {
      if (option && option.appid) {
        this.local.current = { appid: option.appid, name: option.name }
      }
    },

    setData(data) {
      this.channel = data
      this.local = Object.assign({}, data)
    },

    async completeCurrentGame() {
      const timestamp = new Date().getTime()
      const appid = this.channel.current.appid
      const key = `library.${appid}.completed`
      const data = {}
      data[key] = timestamp
      try {
        const response = await this.axios.patch(`/channels/${this.channel.id}`, data)
        this.setData(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.section p {
  margin-bottom: 1rem;
}

.step-nav {
  display: flex;
  justify-content: flex-end;
}

.step-nav .button:last-of-type {
  margin-left: 10px;
}

.max-width-input {
  max-width: 300px;
}

.complete {
  padding: 40px 0;
}
</style>