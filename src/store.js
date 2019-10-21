import Vue from 'vue'
import Vuex from 'vuex'
import { getGameLibrary, getTopVotes } from './helpers/api-helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameLibrary: [],
    topVotes: [],
    authenticated: true
  },
  getters: {
    gameLibrary: state => state.gameLibrary,
    eligibleGames: state => {
      return state.gameLibrary.filter(game => !game.ignored && !game.completed)
    },
    ignoredGames: state => {
      return state.gameLibrary.filter(game => game.ignored)
    },
    completedGames: state => {
      return state.gameLibrary.filter(game => game.completed)
    },
    topVotes: state => {
      return state.topVotes
    },
    isAuthenticated: state => {
      return state.authenticated
    }
  },
  mutations: {
    SET_GAME_LIBRARY(state, library) {
      state.gameLibrary = library
    },
    SET_TOP_VOTES(state, games) {
      state.topVotes = games
    },
    SET_AUTHENTICATED(state) {
      state.authenticated = true
    }
  },
  actions: {
    async setGameLibrary({ commit }) {
      const library = await getGameLibrary()
      commit('SET_GAME_LIBRARY', library)
    },
    async setTopVotes({ commit }) {
      const games = await getTopVotes()
      commit('SET_TOP_VOTES', games)
    },
    setAuthenticated({ commit }) {
      commit('SET_AUTHENTICATED')
    }
  }
})
