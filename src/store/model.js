import { getModelList } from '../api/model'

export default {
  namespaced: true,
  state: {
    list: []
  },
  actions: {
    async setList ({ state }) {
      let modelList = await getModelList()
      state.list = modelList
    }
  },
  mutations: {

  }
}
