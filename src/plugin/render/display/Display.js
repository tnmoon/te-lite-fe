// import { THREE } from "three";
import OrbitControls from 'three-orbitcontrols'
import Stats from 'stats.js'
import * as THREE from 'three'

export default class Display {
  constructor () {
    // 场景
    this.scene = new THREE.Scene()

    // 统计窗口
    this.stats = new Stats()
    this.stats.domElement.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000' // 此处修改默认的css样式（靠左），避免遮挡左侧tab
    document.body.appendChild(this.stats.dom)

    // 灯光
    this.lightFlood = new THREE.AmbientLight(0x555555)
    this.lightFlood.intensity = 1.2
    this.lightStareAtCenter = new THREE.SpotLight(0xffffff)
    this.lightStareAtCenter.castShadow = true
    this.lightStareAtCenter.intensity = 0.8
    this.lightStareAtCenter.angle = Math.PI
    this.scene.add(this.lightStareAtCenter)
    this.scene.add(this.lightFlood)

    this.model = null
    this.arrow = null
  }

  renderOneFrame () {
    this.renderer.render(this.scene, this.camera) // 绘制
    this.stats.update() // 更新性能插件
    this.controls.update() // 更新控制器
    this.lightStareAtCenter.position.copy(this.camera.position) // 设置灯光位置跟随相机
  }

  add (element) {
    this.scene.add(element)
  }

  setCanvas (canvasID) {
    // 在 body 中新建一个画布
    // this.canvas = document.createElement('canvas');
    this.canvas = document.getElementById(canvasID)
    let canvasHeight = this.canvas.clientHeight
    let canvasWidth = this.canvas.clientWidth

    // 相机
    this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 10, 1000000)
    this.camera.position.set(0, 80000, 80000)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera.up.set(0, 0, 1)

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿开启
      canvas: this.canvas
    })
    this.renderer.shadowMap.enabled = true // 告诉渲染器需要阴影效果
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setSize(canvasWidth, canvasHeight)
    this.renderer.setClearColor(0x1e1e1e, 1.0)
    this.renderer.localClippingEnabled = true // 允许局部裁剪面

    // 控件
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true // 使动画循环使用时阻尼或自转 意思是否有惯性
    this.controls.dampingFactor = 1 // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    this.controls.enableZoom = true // 是否可以缩放
    this.controls.autoRotate = false // 是否自动旋转
    this.controls.minDistance = 1 // 设置相机距离原点的最远距离
    this.controls.maxDistance = 10000000 // 设置相机距离原点的最远距离
    this.controls.enablePan = true // 是否开启右键拖拽
    this.controls.target = new THREE.Vector3(0, 0, 0) // 设置controls圆球轨道面的中心点

    window.onresize = () => this.resize()
  }

  resize () {
    let canvasHeight = this.canvas.clientHeight
    let canvasWidth = this.canvas.clientWidth
    this.camera.aspect = canvasWidth / canvasHeight
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
    this.renderer.setSize(canvasWidth, canvasHeight)
  }

  locateCamera (x, y, z) {
    console.log(z)
    this.camera.position.set(x, y, z)
  }

  init (canvasID) {
    this.setCanvas(canvasID)
    let animate = () => {
      this.renderOneFrame()
      requestAnimationFrame(animate)
    }
    animate()
  }

  set ({ model, arrow }) {
    this.model = model
    this.arrow = arrow
  }
}
