<template>
  <div class="container">
    <h3>Steam-Quest Configuration</h3>
    <div class="config-container">
      <b-loading :active="userRequestLoading" :is-full-page="false" />
      <b-field label="Steam Profile ID" horizontal grouped>
        <b-input v-model="steamId"></b-input>
        <b-button type="is-primary" :loading="configFormLoading" :disabled="!hasSteamIdChanged" @click="submitConfigForm">Save Steam ID</b-button>
      </b-field>
      <!-- <b-button type="is-secondary" :loading="libraryLoading" @click="getLibrary">Test Steam Library</b-button> -->
      <b-table v-if="!libraryLoading && library.length" :data="library" striped hoverable paginated paginated-simple>
        <template slot-scope="props">
          <b-table-column field="name" label="Game">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column label="Mark as Ignored">
            <b-button type="is-danger">Ignore</b-button>
          </b-table-column>
          <b-table-column label="Mark as Previously Completed">
            <b-button type="is-primary">Completed</b-button>
          </b-table-column>
        </template>
      </b-table>
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
      library: []
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

  methods: {
    async getUser(id) {
      this.userRequestLoading = true
      try {
        const response = await this.axios.get(`/users/${id}`)
        this.user = response.data
        if (this.user.steamId) {
          this.steamId = this.user.steamId
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
      } catch (error) {
        console.log(error)
      }
      this.libraryLoading = false
    }
  }
}
</script>

<style scoped>
.config-container {
  position: relative;
}
</style>