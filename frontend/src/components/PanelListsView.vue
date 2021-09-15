<template>
  <div>
    <b-button type="is-text" icon-left="chevron-left" @click="emitBackClicked">Back</b-button>
    <b-tabs v-model="activeTab" position="is-centered">
      <b-tab-item label="Vote List">
        <b-input
          v-model="searchQuery"
          class="search-input"
          placeholder="Search for a game..."
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="searchQuery = ''"
        ></b-input>
        <b-collapse
          class="card"
          animation="slide"
          v-for="(item, index) of filteredLibrary.slice(0, this.numberOfItems)"
          :key="index"
          :open="voteListOpen === index"
          @open="voteListOpen = index"
        >
          <div
            slot="trigger"
            slot-scope="props"
            class="card-header"
            role="button"
          >
            <p class="card-header-title-p">
              {{ item.name }}
            </p>
            <a class="card-header-icon">
              <b-icon
                :icon="props.open ? 'menu-up' : 'menu-down'">
              </b-icon>
            </a>
          </div>
          <CardContent
            v-if="voteListOpen === index"
            :item="item"
            :isCurrent="currentGame.appid == item.appid"
            @gameSelected="emitGameVoteSelected(item)"
          />
        </b-collapse>
      </b-tab-item>
      <b-tab-item label="Completed">
        <b-collapse
          class="card"
          animation="slide"
          v-for="(item, index) of completed"
          :key="index"
          :open="completedListOpen === index"
          @open="completedListOpen = index"
        >
          <div
            slot="trigger"
            slot-scope="props"
            class="card-header"
            role="button"
          >
            <p class="card-header-title-p">
              {{ item.name }}
            </p>
            <a class="card-header-icon">
              <b-icon
                :icon="props.open ? 'menu-up' : 'menu-down'">
              </b-icon>
            </a>
          </div>
          <CardContent v-if="completedListOpen === index" :item="item" completed />
        </b-collapse>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import CardContent from './CardContent'

export default {
  components: {
    CardContent
  },

  props: {
    library: {
      type: Array,
      default: () => []
    },
    completed: {
      type: Array,
      default: () => []
    },
    currentGame: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      activeTab: 0,
      searchQuery: '',
      debouncedSearchQuery: '',
      numberOfItems: 15,
      libraryLoading: false,
      voteListOpen: null,
      completedListOpen: null
    }
  },

  mounted() {
    this.scroll()
  },

  computed: {
    filteredLibrary() {
      return this.library.filter(item => {
        return item.name.toLowerCase().includes(this.debouncedSearchQuery.toLowerCase())
      })
    }
  },

  watch: {
    searchQuery: function() {
      this.debouncer()
    },
    debouncedSearchQuery: function() {
      this.numberOfItems = 15
      this.voteListOpen = null
      this.completedListOpen = null
    }
  },

  methods: {
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.numberOfItems += 15
        }
      }
    },

    debouncer: debounce(function(){
      this.debouncedSearchQuery = this.searchQuery
    },500),

    emitBackClicked() {
      this.$emit('backClicked')
    },

    emitGameVoteSelected(game) {
      this.$emit('gameVoteSelected', game)
    }
  }
}
</script>

<style scoped>
.card-header-title-p {
  text-align: left;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  overflow : hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1
}
.card-header-icon {
  padding: 0.25rem 0.75rem;
}

.search-input {
  margin-bottom: 0.75rem;
}
</style>