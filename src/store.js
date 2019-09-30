import Vue from 'vue'
import Vuex from 'vuex'
import { getGameLibrary } from './helpers/api-helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameLibrary: []
  },
  getters: {
    gameLibrary: state => {
      return state.gameLibrary.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  mutations: {
    SET_GAME_LIBRARY(state, library) {
      state.gameLibrary = library
    }
  },
  actions: {
    async setGameLibrary({ commit }) {
      const library = await getGameLibrary()
      commit('SET_GAME_LIBRARY', library)
    }
  }
})
