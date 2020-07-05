<template>
  <div class="has-text-centered">
    <div class="card-content">
      <div class="card-image">
        <img :src="`http://media.steampowered.com/steamcommunity/public/images/apps/${item.appid}/${item.img_logo_url}.jpg`" alt="Game Logo">
      </div>
      <h2 class="subtitle">{{ item.name }}</h2>
      <div v-if="completed">
        <p>{{ item.completed }}</p>
      </div>
      <div v-else>
        <div>
          Total Votes: XX
        </div>
        <div>
          <b-button type="is-primary" @click="voteClick">Vote For This Game</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      voteClick() {
        this.$emit('gameSelected')
      }
    }
  }
</script>

<style scoped>
.subtitle:not(:last-child) {
  margin-bottom: 0;
}
</style>