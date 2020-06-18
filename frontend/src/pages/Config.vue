<template>
  <div class="container">
    <h3>Steam Quest Configuration</h3>
    <div v-if="channelRequestLoading" class="section">
      <b-loading :active="true" :is-full-page="false" />
      Loading
    </div>
    <div v-else>
      <div class="section">
        <div v-if="newChannel" class="new-user-info">
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
        <b-field label="Steam Profile ID" horizontal grouped>
          <b-input v-model="local.steamId"></b-input>
          <b-button type="is-primary" :loading="saveSteamIdLoading" :disabled="!hasSteamIdChanged" @click="saveSteamIdClick">Save Steam ID</b-button>
        </b-field>
      </div>
      <div v-if="!libraryLoading && library.length" class="section">
        <p>All items in your Steam library are included and will be eligible for voting by default. You may choose to mark an item as Ignored or Previously Completed if you do not want it to be eligible for voting.</p>
        <p><b-tag type="is-danger" size="is-medium">Ignored</b-tag> items will not show up in the list and can not be voted on. <b-tooltip :label="ignoredTooltip" dashed multilined>What should be marked as ignored?</b-tooltip></p>
        <p><b-tag type="is-primary" size="is-medium">Previously Completed</b-tag> games will show up in the list, but will be marked as completed and can not be voted on.</p>
        <b-table :data="library" striped hoverable paginated paginated-simple>
          <template slot-scope="props">
            <!-- https://store.steampowered.com/app/ -->
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
        <div class="library-save">
          <b-button type="is-primary" :loading="saveLibraryLoading" @click="saveLibraryClick">Save Library & Continue</b-button>
        </div>
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
      steamId: '',
      local: {
        steamId: '',
        ignored: [],
        previouslyCompleted: [],
        completed: []
      },
      channel: {},
      newChannel: false,
      channelRequestLoading: false,
      saveSteamIdLoading: false,
      library: [],
      libraryLoading: false,
      ignoredTooltip: 'Software, games that can no longer be played (eg: dead servers), or games that don\'t have a definitive end (eg: MMO, multiplayer only)',
      saveLibraryLoading: false
    }
  },

  computed: {
    hasSteamIdChanged() {
      return this.local.steamId && this.local.steamId !== this.channel.steamId
    }
  },

  mounted() {
    window.Twitch.ext.onAuthorized(async (auth) => {
      console.log('channelId: ', auth.channelId)
      console.log('token: ', auth.token)
      console.log('userId: ', auth.userId)

      this.axios = createAxios(auth.token)

      await this.getChannel(auth.channelId)
    })

    window.Twitch.ext.onContext(context => {
      window.Twitch.ext.rig.log('mode: ', context.mode)
    })
  },

  watch: {
    completed: function (val) {
      console.log(val)
    }
  },

  methods: {
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

    async saveSteamIdClick() {
      this.saveSteamIdLoading = true
      if (this.newChannel) {
        await this.createChannelData()
      } else {
        await this.updateChannelData()
      }
      this.saveSteamIdLoading = false
      this.getLibrary()
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
        const library = await this.axios.get(`/channels/${this.channel.id}/library`)

        this.library = library.data
        console.log(this.library)
      } catch (error) {
        console.log(error)
      }
      this.libraryLoading = false
    },

    async saveLibraryClick() {
      this.saveLibraryLoading = true
      await this.updateChannelData()
      this.saveLibraryLoading = false
    }
  }
}
</script>

<style scoped>
.section p {
  margin-bottom: 1rem;
}

.library-save {
  display: flex;
  justify-content: flex-end;
}
</style>