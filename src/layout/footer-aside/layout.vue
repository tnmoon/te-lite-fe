<template>
  <div class="wrapper">
    <div class="upper">
      <div class="aside">
        <div class="top-wrapper">
          <i
            :class="[
              'icon',
              'el-icon-document',
              {'is-choosen':this.$route.path === '/document'}
            ]"
            @click="onDocumentClick"
          ></i>
          <i
            :class="[
              'icon',
              'el-icon-edit',
              {'is-choosen':this.$route.path === '/expression'}
            ]"
            @click="onExpressionClick"
          ></i>
          <i
            :class="[
              'icon',
              'el-icon-star-off',
              {'is-choosen':this.$route.path === '/lkl'}
            ]"
          ></i>
        </div>
        <div class="down-wrapper">
          <i class="icon el-icon-setting"></i>
        </div>
      </div>
      <div class="detail" v-show="showDetail">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
      <div class="content">
        <canvas id="canvas" ref="canvas"></canvas>
      </div>
    </div>
    <div class="footer top-footer">
      <div class="coordinate">
        <i class="footer-text">全国活动断层-大工区1</i>
        <i class="footer-text">X: 144, Y: 123, Z: 34</i>
      </div>
      <div class="right-part">
        <div class="progress">
          <el-progress :percentage="percentage"></el-progress>
        </div>
        <i class="footer-text">lishuhang1995@163.com</i>
      </div>
    </div>
    <div class="footer bottom-footer">
      <div class="edition">
        <p class="bottom-footer-text">Transparent Earth Lite 0.1</p>
      </div>
      <div class="copyright">
        <p class="bottom-footer-text">Copyright @ 2018 GridWorld. All Rights Reserved</p>
      </div>
    </div>
  </div>
</template>

<script>
import { display, model } from '../../plugin/render'

export default {
  name: 'layout-footer-aside',
  data () {
    return {
      showDetail: true,
      queue: model.queue
    }
  },
  methods: {
    onDocumentClick () {
      this.showDetail = !this.showDetail
      if (this.$route.path !== '/document') {
        this.showDetail = true
        this.$router.push('document')
      }
    },
    onExpressionClick () {
      this.showDetail = !this.showDetail
      if (this.$route.path !== '/expression') {
        this.showDetail = true
        this.$router.push('expression')
      }
    }
  },
  computed: {
    percentage () {
      if (!this.queue.totalBlockCount) return 100
      let num = 100 * (this.queue.totalBlockCount - this.queue.size) / this.queue.totalBlockCount
      return Math.floor(num * 10) / 10
    }
  },
  mounted () {
    display.init('canvas')
  },
  updated () {
    display.resize()
  }
}
</script>

<style lang="scss">
.wrapper {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .upper {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    height: 100px;
    width: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    .aside {
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 58px;
      background-color: #333333;
      font-size: 30px;
      flex-shrink: 0;
      .top-wrapper {
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        align-items: center;
        .is-choosen {
          color: white;
        }
      }
      .icon {
        color: gray;
        margin-top: 15px;
        margin-bottom: 15px;
      }
    }
    .detail {
      width: 290px;
      background-color: #252526;
      flex-shrink: 0;
    }
    .content {
      width: 100px;
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      #canvas {
        height: 100% !important;
        width: 100% !important;
      }
    }
  }
  .footer {
    padding-left: 10px;
    padding-right: 10px;
    flex-shrink: 0;
  }
  .top-footer {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    background-color: #007ad3;
    .footer-text {
      font-size: 13px;
      margin-right: 20px;
      color: white;
      font-style: normal;
    }
    .right-part {
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .progress {
        width: 200px;
        margin-right: 20px;
        .el-progress__text {
          color: white;
        }
        .el-progress-bar__inner{
          transition-duration: 0s;
        }
        .el-progress__text{
          font-size: 13px !important;
          margin-left:15px;
        }
      }
    }
  }
  .bottom-footer {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 17px;
    background-color: black;
    .bottom-footer-text {
      font-size: 5px;
      color: gray;
      margin: 0;
    }
  }
}
</style>
