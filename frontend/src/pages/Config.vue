<template>
  <div>
    <h3>Steam-Quest Configuration</h3>
    <div class="config-container">
      <b-loading :active="userRequestLoading" :is-full-page="false" />
      <b-field label="Steam Profile ID">
        <b-input v-model="user.steamId"></b-input>
      </b-field>
      <b-button type="is-primary" :loading="configFormLoading" @click="submitConfigForm">Save</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user: {},
      newUser: false,
      userRequestLoading: false,
      configFormLoading: false
    }
  },

  mounted() {
    window.Twitch.ext.onAuthorized(async (auth) => {
      console.log('channelId: ', auth.channelId)
      console.log('token: ', auth.token)
      console.log('userId: ', auth.userId)

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
        const response = await axios.get(`https://us-central1-steam-quest-ed9fd.cloudfunctions.net/api/users/${id}`)
        this.user = response.data
      } catch (error) {
        console.error(error)
      }
      this.userRequestLoading = false
    },

    async submitConfigForm() {
      this.configFormLoading = true
      try {
        await axios.post('https://us-central1-steam-quest-ed9fd.cloudfunctions.net/api/users', this.user)
      } catch (error) {
        console.log(error)
      }
      this.configFormLoading = false
    }
  }
}
</script>

<style scoped>
.config-container {
  position: relative;
}
</style>