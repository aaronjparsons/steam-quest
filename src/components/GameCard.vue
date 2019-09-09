<template>
  <div>
    <img
      :src="`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`"
    />
    <p>{{ game.name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>