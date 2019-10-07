import Vue from 'vue'
import Vuex from 'vuex'
import { getGameLibrary } from './helpers/api-helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameLibrary: [],
    authenticated: false
  },
  getters: {
    gameLibrary: state => {
      return state.gameLibrary
    },
    topVotes: state => {
      return state.gameLibrary
        .sort((a, b) => {
          return b.votes - a.votes
        })
        .slice(0, 5)
    },
    isAuthenticated: state => {
      return state.authenticated
    }
  },
  mutations: {
    SET_GAME_LIBRARY(state, library) {
      state.gameLibrary = library
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
    setAuthenticated({ commit }) {
      commit('SET_AUTHENTICATED')
    }
  }
})
