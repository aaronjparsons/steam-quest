<template>
  <div class="container">
    <h3>Steam Quest Configuration</h3>
    <div v-if="userRequestLoading" class="section">
      <b-loading :active="true" :is-full-page="false" />
      Loading
    </div>
    <div v-else>
      <div class="section">
        <div v-if="newUser" class="new-user-info">
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
          <b-input v-model="steamId"></b-input>
          <b-button type="is-primary" :loading="configFormLoading" :disabled="!hasSteamIdChanged" @click="submitConfigForm">Save Steam ID</b-button>
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
              <b-checkbox v-model="ignored" type="is-danger" :native-value="props.row.appid"></b-checkbox>
            </b-table-column>
            <b-table-column label="Mark as Previously Completed" centered>
              <b-checkbox v-model="completed" type="is-primary" :native-value="props.row.appid"></b-checkbox>
            </b-table-column>
          </template>
        </b-table>
        <p>After you have gone through your game library and marked all the necessary games, hit save to continue the configuration.</p>
        <div class="library-save">
          <b-button type="is-primary">Save Library & Continue</b-button>
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
      user: {},
      newUser: false,
      userRequestLoading: false,
      configFormLoading: false,
      libraryLoading: false,
      library: [],
      ignored: [],
      completed: [],
      ignoredTooltip: 'Software, games that can no longer be played (eg: dead servers), or games that don\'t have a definitive end (eg: MMO, multiplayer only)'
    }
  },

  computed: {
    hasSteamIdChanged() {
      return this.steamId && this.steamId !== this.user.steamId
    }
  },

  mounted() {
    window.Twitch.ext.onAuthorized(async (auth) => {
      console.log('channelId: ', auth.channelId)
      console.log('token: ', auth.token)
      console.log('userId: ', auth.userId)

      this.axios = createAxios(auth.token)

      await this.getUser(auth.userId)

      if (!Object.keys(this.user).length) {
        this.newUser = true
        this.user = {
          id: auth.userId,
          steamId: ''
        }
      }
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
    async getUser(id) {
      this.userRequestLoading = true
      try {
        const response = await this.axios.get(`/users/${id}`)
        this.user = response.data
        if (this.user.steamId) {
          this.steamId = this.user.steamId
          this.getLibrary()
        }
      } catch (error) {
        console.error(error)
      }
      this.userRequestLoading = false
    },

    async submitConfigForm() {
      this.configFormLoading = true
      try {
        if (this.newUser) {
          await this.axios.post('/users', {
            id: this.user.id,
            steamId: this.steamId
          })
        } else {
          await this.axios.patch(`/users/${this.user.id}`, {
            steamId: this.steamId
          })
        }

        this.user.steamId = this.steamId
        this.getLibrary()
      } catch (error) {
        console.log(error)
      }
      this.configFormLoading = false
    },

    async getLibrary() {
      this.libraryLoading = true
      try {
        const library = await this.axios.get(`/users/${this.user.id}/library`)

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

.library-save {
  display: flex;
  justify-content: flex-end;
}
</style>