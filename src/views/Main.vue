<template>
  <div class="container">
    <div class="title">STEAM-QUEST</div>
    <div class="live">
      <div class="left">
        <iframe
          src="https://player.twitch.tv/?channel=chewydinosaur"
          height="100%"
          width="100%"
          :allowfullscreen="true"
        ></iframe>
        <div class="playing">
          Currently playing:
          <span>Game Name</span>
        </div>
      </div>
      <div class="right">
        <div class="summary-header">
          <h4>Current Round of Voting</h4>
        </div>
        <div class="summary-list">
          <div class="vote-item" v-for="(game, index) in topVotes" :key="index">
            <div
              class="vote-item-name"
              :class="firstItemClass(index)"
            >{{ index + 1 }}. {{ game.name }}</div>
            <div class="vote-item-votes">Votes: {{ game.votes }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="games-table">
      <div class="games-table-header">
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
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchFilter: ''
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
    hasGames() {
      return this.gameLibrary.length > 0
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
    },
    topVotes() {
      return this.$store.getters.topVotes
    }
  },

  methods: {
    firstItemClass(index) {
      return index === 0 ? 'top-votes' : null
    }
  }
}
</script>

<style lang="scss">
.left {
  iframe {
    height: 100% !important;
    border-radius: 5px;
  }
}
</style>
<style lang="scss" scoped>
// Color Palette Variables
$sq-background-dark: #0b0c10;
$sq-background: #1f2833;
$sq-text: #c5c6c7;
$sq-primary: #66fcf1;
$sq-accent: #45a29e;

.title {
  color: $sq-primary;
  font-family: 'Big Shoulders Display';
  font-size: 72px;
  padding: 20px;
  text-align: center;
}

.live {
  display: flex;
  height: 500px;

  .left {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 100%;
    margin: 10px 5px 10px 0;
    border-radius: 5px;

    .playing {
      color: $sq-text;
      background: $sq-background;
      margin-top: 10px;
      border-radius: 5px;
      padding: 20px;

      span {
        color: $sq-primary;
      }
    }
  }

  .right {
    color: $sq-text;
    background: $sq-background;
    width: 30%;
    height: 100%;
    margin: 10px 0 10px 5px;
    border-radius: 5px;
    padding: 10px;

    .summary-header {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
      border-bottom: 1px solid #2d3b49;
    }

    .vote-item {
      margin: 5px 0 5px 0;
    }

    .vote-item-name {
      text-overflow: ellipsis;
    }

    .top-votes {
      font-size: 18px;
      color: $sq-primary;
    }

    .vote-item-votes {
      text-align: right;
    }
  }
}

.games-table {
  margin-top: 20px;
  background: $sq-background;

  .games-table-header {
    padding: 20px;
  }
}
</style>