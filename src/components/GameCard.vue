<template>
  <div class="max-w rounded overflow-hidden shadow-lg m-2">
    <div
      class="border border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded p-4 flex"
    >
      <img
        :src="`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`"
      />
      <div class="pl-5 flex flex-grow items-center">
        <div class="text-gray-900 font-bold text-xl mb-2">{{ game.name }}</div>
      </div>
      <div class="flex flex-col items-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Vote</button>
        <div class="text-sm">
          <p class="text-gray-600">Aug 18</p>
        </div>
      </div>
    </div>
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