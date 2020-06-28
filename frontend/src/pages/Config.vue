<template>
  <div class="container">
    <h3>Steam Quest Configuration</h3>
    <div class="section">
      <div v-if="channelRequestLoading" class="section">
        <b-loading :active="true" :is-full-page="false" />
        Loading
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
                  To begin configuring Steam Quest, enter your 17 digit Steam ID number. Your Steam account must not be private,
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
              <b-table :data="library" striped hoverable paginated paginated-simple>
                <template slot-scope="props">
                  <b-table-column field="name" label="Game">
                    {{ props.row.name }} <a :href="`https://store.steampowered.com/app/${props.row.appid}`" target="_blank"><b-icon icon="open-in-new" size="is-small"></b-icon></a>
                  </b-table-column>
                  <b-table-column label="Mark as Ignored" centered>
                    <b-checkbox v-model="local.ignored" type="is-danger" :native-value="props.row.appid"></b-checkbox>
                  </b-table-column>
                  <b-table-column label="Mark as Previously Completed" centered>
                    <b-checkbox v-model="local.previouslyCompleted" type="is-primary" :native-value="props.row.appid"></b-checkbox>
                  </b-table-column>
                </template>
              </b-table>
              <p>After you have gone through your game library and marked all the necessary games, hit save to continue the configuration.</p>
            </div>
          </b-step-item>

          <b-step-item step="3" label="Channel Options">
            <div class="section">
              <h2 class="title is-4">Setup Bits</h2>
              <h4 class="subtitle is-6">(Optional)</h4>
              <b-field :message="bitsEnableMessage" :type="channelBitsEnabled ? '' : 'is-danger'">
                <b-checkbox v-model="local.bitsEnabled" :disabled="!channelBitsEnabled">Enable bits for Steam Quest?</b-checkbox>
              </b-field>
              <b-field v-if="local.bitsEnabled" label="Bit amount per vote" :message="bitsVoteValueMessage">
                <b-numberinput v-model="local.bitsVoteValue" class="max-width-input" min="1" max="1000"></b-numberinput>
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
            <div class="has-text-centered">
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
        ignored: [],
        previouslyCompleted: [],
        completed: [],
        votes: [],
        current: '',
        bitsEnabled: false,
        bitsVoteValue: 20
      },
      currentGameInput: '',
      channel: {},
      newChannel: false,
      channelRequestLoading: false,
      library: [],
      libraryLoading: false,
      ignoredTooltip: 'Software, videos/movies, and anything else you do not want to show up in your library list.',
      firstGameMessage: 'Already know what the first game you\'ll be playing is? Set it here!',
      nextStepLoading: false
    }
  },

  computed: {
    channelBitsEnabled() {
      return window.Twitch.ext.features.isBitsEnabled
    },
    bitsEnableMessage() {
      return this.channelBitsEnabled
        ? 'Enabling bits on this extension will allow viewers to use bits to increase their vote count.'
        : 'Your channel does not allow bits to be enabled.'
    },
    bitsVoteValueMessage() {
      return `Example: A viewer can spend ${this.local.bitsVoteValue * 5} bits to have their vote counted 5 times.`
    },
    filteredLibrary() {
      return this.library.filter(app => {
        if (this.local.ignored.includes(app.appid) || this.local.previouslyCompleted.includes(app.appid)) {
          return false
        } else {
          return app.name.toLowerCase().includes(this.currentGameInput.toLowerCase())
        }
      })
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
    async nextStepAction() {
      this.nextStepLoading = true

      switch (this.activeStep) {
        case 0:
          if (this.channel.steamId) {
            await this.updateChannelData()
          } else {
            await this.createChannelData()
          }
          await this.getLibrary()

          if (this.library.length) {
            // TODO - Error handling for incorrect steam id or private account
            this.activeStep = 1
          }
          break
        case 1:
          await this.updateChannelData()
          if (this.local.current && this.local.current.name) {
            this.currentGameInput = this.local.current.name
          }
          this.activeStep = 2
          break
        case 2:
          await this.updateChannelData()
          this.activeStep = 3
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
        this.channel = response.data

        if (this.channel && this.channel.steamId) {
          this.local = this.channel
          this.getLibrary()
        } else {
          this.newChannel = true
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
        await this.axios.post('/channels', this.local)

        this.channel = this.local
      } catch (error) {
        console.log(error)
      }
    },

    async updateChannelData() {
      try {
        await this.axios.patch(`/channels/${this.channel.id}`, this.local)

        this.channel = this.local
      } catch (error) {
        console.log(error)
      }
    },

    async getLibrary() {
      this.libraryLoading = true
      try {
        const library = await this.axios.get(`/channels/${this.channel.id}/steamlibrary`)

        this.library = library.data
        console.log(this.library)
      } catch (error) {
        console.log(error)
      }
      this.libraryLoading = false
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
</style>