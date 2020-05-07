export default class Block {
  constructor (data) {
    this.data = data

    let arrayIndex = (firstIndex, secondIndex) => {
      return firstIndex * (this.data.vertice.length / 3) + secondIndex
    }
    let reverseArrayIndex = (index) => {
      return {
        firstIndex: Math.floor(index / (this.data.vertice.length / 3)),
        secondIndex: index % (this.data.vertice.length / 3)
      }
    }

    let lineMarking = new Map()
    let lineFaceMarking = new Map()

    for (let index = 0; index < this.data.faceVerticeNum.length; index++) {
      for (let jndex = 0; jndex < this.data.faceVerticeNum[index]; jndex++) {
        let lineStartPoint = this.data.faceVerticeIndex[this.data.faceVerticeIndexOffset[index] + jndex]
        let lineFinishPoint = this.data.faceVerticeIndex[this.data.faceVerticeIndexOffset[index] + (jndex + 1) % this.data.faceVerticeNum[index]]
        let firstIndex = Math.min(lineStartPoint, lineFinishPoint)
        let secondIndex = Math.max(lineStartPoint, lineFinishPoint)
        let finalIndex = arrayIndex(firstIndex, secondIndex)

        if (lineMarking.has(finalIndex)) lineMarking.set(finalIndex, lineMarking.get(finalIndex) + 1)
        else lineMarking.set(finalIndex, 1)

        if (lineFaceMarking.has(finalIndex)) lineFaceMarking.get(finalIndex).push(index)
        else lineFaceMarking.set(finalIndex, [index])
      }
    }

    let lineVerticeIndex = new Uint32Array(lineMarking.size * 2)
    let lineFaceIndex = new Array(lineMarking.size)
    let lineVerticeIndexIndex = 0

    for (let key of lineMarking.keys()) {
      lineFaceIndex[lineVerticeIndexIndex / 2] = lineFaceMarking.get(key)
      let { firstIndex, secondIndex } = reverseArrayIndex(key)
      lineVerticeIndex[lineVerticeIndexIndex++] = firstIndex
      lineVerticeIndex[lineVerticeIndexIndex++] = secondIndex
    }

    this.data.lineVerticeIndex = lineVerticeIndex
    this.data.lineFaceIndex = lineFaceIndex

    let faceCellIndex = new Int32Array(this.data.faceVerticeNum.length * 2).fill(-1)
    let faceCellDirection = new Int8Array(this.data.faceVerticeNum.length * 2).fill(-1)

    for (let jCell = 0; jCell < this.data.cellFaceNum.length; jCell++) {
      for (let jFace = this.data.cellFaceIndexOffset[jCell]; jFace < this.data.cellFaceIndexOffset[jCell + 1]; jFace++) { // 遍历单个cell下所有的face
        if (faceCellIndex[2 * this.data.cellFaceIndex[jFace]] === -1) faceCellIndex[2 * this.data.cellFaceIndex[jFace]] = jCell
        else faceCellIndex[2 * this.data.cellFaceIndex[jFace] + 1] = jCell

        if (faceCellDirection[2 * this.data.cellFaceIndex[jFace]] === -1) faceCellDirection[2 * this.data.cellFaceIndex[jFace]] = this.data.faceDirectionPerCell[jFace]
        else faceCellDirection[2 * this.data.cellFaceIndex[jFace] + 1] = this.data.faceDirectionPerCell[jFace]
      }
    }

    this.data.faceCellIndex = faceCellIndex
    this.data.faceCellDirection = faceCellDirection
  }

  extractShellFace () {
    let shellFaceCount = 0
    for (let index = 0; index < this.data.faceCellIndex.length / 2; index++) {
      if (this.data.faceCellIndex[2 * index] === -1 || this.data.faceCellIndex[2 * index + 1] === -1) { shellFaceCount++ }
    }

    let shellFaceIndex = new Uint32Array(shellFaceCount)
    let shellFaceCellIndex = new Uint32Array(shellFaceCount)
    let shellFaceIndexIndex = 0
    for (let index = 0; index < this.data.faceCellIndex.length / 2; index++) {
      if (this.data.faceCellIndex[2 * index] === -1 || this.data.faceCellIndex[2 * index + 1] === -1) {
        shellFaceIndex[shellFaceIndexIndex] = index
        if (this.data.faceCellIndex[2 * index] === -1) {
          shellFaceCellIndex[shellFaceIndexIndex++] = this.data.faceCellIndex[2 * index + 1]
        } else {
          shellFaceCellIndex[shellFaceIndexIndex++] = this.data.faceCellIndex[2 * index]
        }
      }
    }
    return {
      shellFaceIndex,
      shellFaceCellIndex
    }
  }
}
