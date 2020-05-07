import Display from './display'
import Model from './model'
import Arrow from './arrow'

let model = new Model(); let display = new Display(); let arrow = new Arrow()

model.set({ display, arrow })
display.set({ model, arrow })
arrow.set({ display, model })

export { model, display, arrow }
