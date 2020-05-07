import Vue from 'vue'
import Vuex from 'vuex'
import model from './model'
// import display from './display'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    model
  }
})
