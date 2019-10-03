<template>
  <div class="game-table">
    <b-table :data="gameLibrary" :striped="true" :hoverable="true" :loading="!hasGames">
      <template slot-scope="props">
        <b-table-column field="game" label="Game">{{ props.row.name }}</b-table-column>
        <b-table-column field="vote" label="Last Name">
          <b-button type="is-success">Vote</b-button>
        </b-table-column>
        <b-table-column field="date" label="Date" centered>
          <span class="tag is-success">...</span>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  computed: {
    gameLibrary() {
      return this.$store.getters.gameLibrary
    },
    hasGames() {
      return this.gameLibrary.length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
.game-card-container {
  padding: 10px;
}
</style>