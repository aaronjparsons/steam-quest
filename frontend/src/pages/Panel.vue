<template>
  <div>
    <p>Broadcaster</p>
  </div>
</template>

<script>
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
  }
}
</script>

<style lang="scss" scoped>

</style>