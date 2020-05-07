import * as THREE from 'three'

export default class Arrow {
  constructor () {
    this.model = null
    this.display = null
    this.blockPool = []
  }

  set ({ model, display }) {
    this.model = model
    this.display = display

    // 拦截 model.blockPool 数组
    Object.defineProperty(this.model, 'blockPool', {
      enumerable: true,
      configurable: true,
      get: () => {
        return this.blockPool
      },
      set: (newVal) => {
        if (!(newVal instanceof Array)) return
        this.display.scene.dispose()

        for (let mesh of this.display.scene.children) {
          if (mesh.type === 'Mesh') {
            mesh.geometry.dispose()
            mesh.material.dispose()
          }
        }
        this.display.scene.children.splice(2, this.display.scene.children.length - 2)

        this.blockPool = newVal
        this.observeArray(this.blockPool) // 拦截 blockPool 数组的 push 方法

        for (let block of this.blockPool) {
          this.addBlockToScene(block)
        }
      }
    })
  }

  observeArray (data) {
    if (!(data instanceof Array)) return

    const this_ = this

    const arrayProto = Array.prototype
    const arrayMethods = Object.create(arrayProto)
    data.__proto__ = arrayMethods

    function def (obj, key, val) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        value: val
      })
    }

    let original = arrayProto['push']
    def(arrayMethods, 'push', function mutator () {
      let i = arguments.length
      let args = new Array(i)
      while (i--) {
        args[i] = arguments[i]
        this_.addBlockToScene(args[i]) // 注入要进行的操作
      }

      original.apply(this, args)
    })
  }

  addBlockToScene (block) {
    let { shellFaceIndex, shellFaceCellIndex } = block.extractShellFace()

    let triangleFaceCount = 0
    //  let lineCount = 0
    for (let index = 0; index < shellFaceIndex.length; index++) {
      let currentLineCount = block.data.faceVerticeNum[shellFaceIndex[index]]
      // lineCount += currentLineCount
      triangleFaceCount += (currentLineCount - 2)
    }

    let triangleShellFacePosition = new Float32Array(triangleFaceCount * 9)
    let triangleShellFaceColor = new Float32Array(triangleFaceCount * 9)
    let triangleShellFaceCellIndex = new Uint32Array(triangleFaceCount)
    let triangleShellFacePositionIndex = 0

    for (let index = 0; index < shellFaceIndex.length; index++) {
      let shellFaceDirection = 0
      if (block.data.faceCellIndex[2 * shellFaceIndex[index]] === shellFaceCellIndex[index]) shellFaceDirection = block.data.faceCellDirection[2 * shellFaceIndex[index]]
      else shellFaceDirection = block.data.faceCellDirection[2 * shellFaceIndex[index] + 1]

      for (let jndex = 1; jndex < block.data.faceVerticeNum[shellFaceIndex[index]] - 1; jndex++) {
        // triangleShellFaceColor[triangleShellFacePositionIndex] = shellFaceColor[3 * index];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 1] = shellFaceColor[3 * index + 1];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 2] = shellFaceColor[3 * index + 2];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 3] = shellFaceColor[3 * index];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 4] = shellFaceColor[3 * index + 1];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 5] = shellFaceColor[3 * index + 2];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 6] = shellFaceColor[3 * index];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 7] = shellFaceColor[3 * index + 1];
        // triangleShellFaceColor[triangleShellFacePositionIndex + 8] = shellFaceColor[3 * index + 2];

        triangleShellFaceColor[triangleShellFacePositionIndex] = 0
        triangleShellFaceColor[triangleShellFacePositionIndex + 1] = 0.3
        triangleShellFaceColor[triangleShellFacePositionIndex + 2] = 0.3
        triangleShellFaceColor[triangleShellFacePositionIndex + 3] = 0
        triangleShellFaceColor[triangleShellFacePositionIndex + 4] = 0.3
        triangleShellFaceColor[triangleShellFacePositionIndex + 5] = 0.3
        triangleShellFaceColor[triangleShellFacePositionIndex + 6] = 0
        triangleShellFaceColor[triangleShellFacePositionIndex + 7] = 0.3
        triangleShellFaceColor[triangleShellFacePositionIndex + 8] = 0.3

        triangleShellFaceCellIndex[triangleShellFacePositionIndex / 9] = shellFaceCellIndex[index]

        if (shellFaceDirection === 0) {
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]] + 2]

          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1] + 2]

          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex] + 2]
        } else {
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]]] + 2]

          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex] + 2]

          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1]]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1] + 1]
          triangleShellFacePosition[triangleShellFacePositionIndex++] = block.data.vertice[3 * block.data.faceVerticeIndex[block.data.faceVerticeIndexOffset[shellFaceIndex[index]] + jndex + 1] + 2]
        }
      }
    }

    let blockFaceGeometry = new THREE.BufferGeometry()

    blockFaceGeometry.addAttribute('position', new THREE.Float32BufferAttribute(triangleShellFacePosition, 3))
    blockFaceGeometry.addAttribute('color', new THREE.Float32BufferAttribute(triangleShellFaceColor, 3))
    blockFaceGeometry.userData = triangleShellFaceCellIndex
    blockFaceGeometry.computeBoundingBox()

    let center = new THREE.Vector3()
    this.model.boundingBox.getCenter(center)
    blockFaceGeometry.translate(-center.x, -center.y, -center.z)

    let faceMaterial = new THREE.MeshPhongMaterial({
      vertexColors: THREE.FaceColors,
      flatShading: true
    })
    let blockFaceMesh = new THREE.Mesh(blockFaceGeometry, faceMaterial)

    this.display.add(blockFaceMesh)
  }
}
