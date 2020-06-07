<template>
  <div>
    <p>User</p>
  </div>
</template>

<script>
export default {
  mounted() {
    window.Twitch.ext.onAuthorized(auth => {
      window.Twitch.ext.rig.log('channelId: ', auth.channelId)
      window.Twitch.ext.rig.log('token: ', auth.token)
      window.Twitch.ext.rig.log('userId: ', auth.userId)
    })

    window.Twitch.ext.onContext(context => {
      window.Twitch.ext.rig.log('mode: ', context.mode)
    })
  }
}
</script>

<style lang="scss" scoped>

</style>