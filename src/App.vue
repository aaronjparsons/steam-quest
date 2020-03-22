<template>
  <div class="container">
    <div class="dev-controls">
      <b-radio v-model="currentPage" native-value="BroadcasterPage">BroadcasterPage</b-radio>
      <b-radio v-model="currentPage" native-value="UserPage">UserPage</b-radio>
    </div>
    <div class="panel">
      <component :is="pages[currentPage]" />
    </div>
  </div>
</template>

<script>
import BroadcasterPage from './pages/BroadcasterPage'
import UserPage from './pages/UserPage'

const pages = {
  BroadcasterPage,
  UserPage
}

export default {
  name: 'App',
  components: {
    ...pages
  },

  data() {
    return {
      pages,
      currentPage: 'BroadcasterPage'
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dev-controls {
  padding: 20px;
  height: 150px;
}

.panel {
  width: 318px;
  height: 496px;
}
</style>
