<template>
  <div>
    <p>Broadcaster</p>
    <b-button @click="userCreate">Create Test</b-button>
    <b-button @click="usersGet">Get Test</b-button>
  </div>
</template>

<script>
import { createUser, getAllUsers } from '../firebase/db/User'

const twitch = window.Twitch.ext

export default {
  data() {
    return {
      //
    }
  },

  mounted() {
    twitch.onAuthorized(auth => {
      twitch.rig.log('channelId: ', auth.channelId)
      twitch.rig.log('token: ', auth.token)
      twitch.rig.log('userId: ', auth.userId)
    })

    twitch.onContext(context => {
      twitch.rig.log('mode: ', context.mode)
    })

    twitch.rig.log(twitch.features.isBitsEnabled)
  },

  methods: {
    userCreate() {
      createUser({
        name: 'Name',
        age: 30
      })
    },
    usersGet() {
      getAllUsers()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>