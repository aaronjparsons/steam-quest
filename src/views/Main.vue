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
      <div class="right"></div>
    </div>
    <div class="games-table">
      <b-table
        :data="gameLibrary"
        :striped="true"
        :hoverable="true"
        :loading="!hasGames"
        default-sort="name"
      >
        <template slot-scope="props">
          <b-table-column field="name" label="Game" sortable>
            <a
              :href="`https://store.steampowered.com/app/${props.row.appid}/`"
              target="_blank"
            >{{ props.row.name }}</a>
          </b-table-column>
          <b-table-column field="vote" label="Last Name">
            <b-button type="is-primary" outlined>Vote</b-button>
          </b-table-column>
          <b-table-column field="date" label="Votes" centered sortable>00</b-table-column>
        </template>
      </b-table>
    </div>
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
    background: $sq-background;
    width: 30%;
    height: 100%;
    margin: 10px 0 10px 5px;
    border-radius: 5px;
  }
}

.games-table {
  margin-top: 20px;
}
</style>