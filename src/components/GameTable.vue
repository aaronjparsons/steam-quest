<template>
  <div class="games-table">
    <div class="games-table-header">
      <b-tabs v-model="activeTab" type="is-toggle" expanded>
        <b-tab-item label="Eligible Games"></b-tab-item>
        <b-tab-item label="Ignored Games"></b-tab-item>
        <b-tab-item label="Completed Games"></b-tab-item>
      </b-tabs>
      <b-input v-model="searchFilter" placeholder="Search for a game..."></b-input>
    </div>
    <b-table
      :data="filteredGames"
      :striped="true"
      :hoverable="true"
      :loading="!hasGames"
      :paginated="true"
      per-page="20"
      default-sort="name"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Game" sortable>
          <a
            :href="`https://store.steampowered.com/app/${props.row.appid}/`"
            target="_blank"
          >{{ props.row.name }}</a>
        </b-table-column>
        <b-table-column field="vote" label="Vote Command">!vote-{{ props.row.appid }}</b-table-column>
        <b-table-column field="votes" label="Votes" centered sortable>{{ props.row.votes }}</b-table-column>
        <b-table-column v-if="isDashboard" field="ignore" label="Ignore" centered sortable>
          <b-button
            type="is-primary"
            outlined
            @click="confirmGameIgnore(props.row.name, props.row.appid)"
          >Ignore</b-button>
        </b-table-column>
      </template>
    </b-table>
    <b-modal :active.sync="modalOpen" :can-cancel="['escape', 'outside']" has-modal-card>
      <ConfirmationModal
        :header="modalHeader"
        :message="modalMessage"
        :confirm-action="modalAction"
      />
    </b-modal>
  </div>
</template>

<script>
import { ignoreGame } from '../helpers/api-helpers'
import ConfirmationModal from '../components/ConfirmationModal'

export default {
  components: {
    ConfirmationModal
  },

  data() {
    return {
      activeTab: 0,
      searchFilter: '',
      modalOpen: false,
      modalHeader: '',
      modalMessage: '',
      modalAction: () => {}
    }
  },

  computed: {
    isDashboard() {
      return this.$router.currentRoute.name === 'dashboard'
    },
    gameLibrary() {
      if (this.activeTab === 0) {
        return this.$store.getters.eligibleGames
      } else if (this.activeTab === 1) {
        return this.$store.getters.ignoredGames
      } else {
        return this.$store.getters.completedGames
      }
    },
    hasGames() {
      return this.$store.getters.gameLibrary.length > 0
    },
    filteredGames() {
      const trimmedSearch = this.searchFilter.trim().toLowerCase()
      if (trimmedSearch.length > 0) {
        return this.gameLibrary.filter(game => {
          return game.name.toLowerCase().includes(trimmedSearch)
        })
      } else {
        return this.gameLibrary
      }
    }
  },

  methods: {
    confirmGameIgnore(gameName, appId) {
      this.modalHeader = `Ignore ${gameName}?`
      this.modalMessage = `Are you sure you want to ignore ${gameName}?`
      this.modalAction = () => this.submitGameIgnore(appId)
      this.modalOpen = true
    },
    async submitGameIgnore(appId) {
      await ignoreGame(appId)
      this.modalOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
// Color Palette Variables
$sq-background-dark: #0b0c10;
$sq-background: #1f2833;
$sq-text: #c5c6c7;
$sq-primary: #66fcf1;
$sq-accent: #45a29e;

.games-table {
  min-height: 250px;
  margin-top: 20px;
  background: $sq-background;
  border-radius: 5px;

  .games-table-header {
    padding: 20px;
  }

  ::v-deep.b-table {
    .level {
      padding: 10px 10px;
    }
  }
}

.center {
  text-align: center;
}
</style>