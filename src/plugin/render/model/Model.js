import { getModelInfo, getBlockData } from '../../../api/model'
import PQueue from 'p-queue'
import Block from './Block'

export default class Model {
  constructor () {
    this.display = null
    this.arrow = null
    this.boundingBox = null

    this.name = null
    this.blockPool = []
  }

  set ({ display, arrow }) {
    this.display = display
    this.arrow = arrow
  }

  async changeTo (name) {
    this.blockPool = []
    this.name = name
    let { blockList, boundingBox } = await getModelInfo(name)
    this.boundingBox = boundingBox

    let xDuration = this.boundingBox.max.x - this.boundingBox.min.x
    let yDuration = this.boundingBox.max.y - this.boundingBox.min.y
    this.display.locateCamera(0, 0, 1.2 * Math.max(xDuration, yDuration))
    let task = (blockName) => {
      return async () => {
        let blockData = await getBlockData(blockName)
        // 这里是为了处理当上一套grid还未传输完毕时，用户又点击了另一套grid的情况
        if (this.name === name) { this.blockPool.push(new Block(blockData)) }
      }
    }

    this.queue.totalBlockCount = blockList.length
    for (let blockName of blockList) {
      this.queue.add((task(blockName)), { priority: 0 })
    }
  }

  clearDownloadQueue () {
    this.queue.clear()
  }
}

if (!Model.prototype.queue) {
  Model.prototype.queue = new PQueue({ concurrency: 9 })
  Model.prototype.queue.totalBlockCount = 0
}
