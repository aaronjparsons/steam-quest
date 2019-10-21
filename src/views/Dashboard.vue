<template>
  <div class="container dashboard">
    <div class="columns">
      <div class="column">
        <div class="panel">
          <div class="panel-header">Currently Playing</div>
          <b-autocomplete
            v-model="currentGame"
            placeholder="Start typing a game name..."
            field="name"
            :data="filteredGames"
            @select="option => currentGame = option"
          ></b-autocomplete>
          <div class="panel-footer">
            <b-button type="is-primary" outlined @click="confirmGameCompleted">Mark Complete</b-button>
            <b-button type="is-primary" outlined @click="confirmGameChange">Change Game</b-button>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="panel">
          <div class="panel-header">Clear Current Votes</div>
          <p>Clear all current votes to start a new round of voting.</p>
          <div class="panel-footer">
            <b-button type="is-primary" outlined @click="confirmClearVotes">Clear Votes</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <GameTable />
      </div>
    </div>
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
import { clearVotes } from '../helpers/api-helpers'
import ConfirmationModal from '../components/ConfirmationModal'
import GameTable from '../components/GameTable'

export default {
  components: {
    ConfirmationModal,
    GameTable
  },

  data() {
    return {
      currentGame: 'Borderlands 2',
      modalOpen: false,
      modalHeader: '',
      modalMessage: '',
      modalAction: () => {}
    }
  },

  created() {
    // If the gameLibrary is empty, dispatch the action to set the gameLibrary
    if (!this.$store.getters.gameLibrary.length) {
      this.$store.dispatch('setGameLibrary')
    }

    // If the top 5 is empty, dispatch the action to set the top 5
    if (!this.$store.getters.topVotes.length) {
      this.$store.dispatch('setTopVotes')
    }
  },

  computed: {
    gameLibrary() {
      return this.$store.getters.gameLibrary
    },
    gameNames() {
      return this.gameLibrary.map(game => game.name)
    },
    filteredGames() {
      return this.gameNames.filter(game => {
        return (
          game
            .toString()
            .toLowerCase()
            .indexOf(this.currentGame.toLowerCase()) >= 0
        )
      })
    },
    topVotes() {
      return this.$store.getters.topVotes
    }
  },

  methods: {
    confirmGameChange() {
      this.modalHeader = 'Change Current Game?'
      this.modalMessage = `Are you sure you want to change the current game to ${this.currentGame}?`
      this.modalAction = this.submitGameChange
      this.modalOpen = true
    },
    submitGameChange() {
      console.log(this.currentGame)
      this.modalOpen = false
    },
    confirmGameCompleted() {
      this.modalHeader = 'Mark Current Game As Completed?'
      this.modalMessage = `Are you sure you want to mark the current game as completed?`
      this.modalAction = this.submitGameCompleted
      this.modalOpen = true
    },
    submitGameCompleted() {
      console.log(this.currentGame)
      this.modalOpen = false
    },
    confirmClearVotes() {
      this.modalHeader = 'Clear All Current Votes?'
      this.modalMessage = `Are you sure you want to clear all votes that have been cast?`
      this.modalAction = this.submitClearVotes
      this.modalOpen = true
    },
    async submitClearVotes() {
      const response = await clearVotes()
      this.modalOpen = false
      if (response.data.success) {
        this.$buefy.toast.open({
          message: 'Votes cleared successfully',
          position: 'is-bottom'
        })
      } else {
        this.$buefy.toast.open({
          message: 'An error ocurred clearing the votes',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
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

.dashboard {
  padding: 80px 0 40px 0;
}

.panel {
  background: $sq-background;
  border-radius: 5px;
  padding: 20px;

  .panel-header {
    font-size: 20px;
    color: $sq-text;
    border-bottom: 1px solid $sq-accent;
    padding-left: 10px;
    margin-bottom: 20px;
  }

  .panel-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 10px;
    }
  }
}
</style>