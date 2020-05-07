import { display } from '../plugin/render'

export default {
  namespaced: true,
  state: {
    display
  },
  actions: {

  },
  mutations: {
    initDisplay (state, canvasID) {
      state.display.setCanvas(canvasID)
      let animate = () => {
        state.display.renderOneFrame()
        requestAnimationFrame(animate)
      }
      animate()
    }
  }
}
