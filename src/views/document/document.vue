<template>
  <div class="document-wrapper">
    <div class="title-wrapper">
      <p class="title">模型列表</p>
    </div>
    <div class="interval">
      <div>
        <i class="el-icon-arrow-down interval-icon"></i>
        <i class="interval-text interval-icon">MODEL LIST</i>
      </div>
      <div>
        <i class="el-icon-refresh interval-icon"></i>
        <i class="el-icon-remove-outline interval-icon last" @click="onPackUp"></i>
      </div>
    </div>
    <div class="scroll-wrapper">
      <my-tree
        :props="defaultProps"
        :indent="0"
        ref="myTree"
        node-key="label"
        empty-text="加载中"
        :load="loadNode"
        lazy
      ></my-tree>
    </div>
  </div>
</template>

<script>
import myTree from '../../components/my-tree'
import { mapState, mapActions } from 'vuex'
import { getGridSizeInfo, getModelGridsList } from '../../api/model'

export default {
  name: 'document',
  components: {
    myTree
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf',
      }
    }
  },
  computed: {
    ...mapState('model', {
      modelList: 'list'
    }),
    modelGridList() {
      let treeOrientedArray = []
      this.modelList.forEach(element => {
        treeOrientedArray.push({
          label: element.split("Model_")[1],
        })
      })
      return treeOrientedArray
    }
  },
  methods: {
    ...mapActions('model', ['setList']),
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.setList().then(() => {
          return resolve(this.modelGridList)
        })
      }
      else {
        let modelName = node.data.label
        getModelGridsList("Model_" + modelName).then(gridList => {
          let childrenList = [], gridNameList = []
          gridList.forEach(gridName => {
            childrenList.push({
              label: gridName,
              content: {
                size: 0,
                cell: 0,
              },
              isLeaf: true,
            })
            gridNameList.push("Model_" + modelName + "-Grid_" + gridName)
          })
          gridNameList.forEach((element, index) => {
            getGridSizeInfo(element).then(result => {
              childrenList[index].content.size = this.renderSize(result.byteSize)
              childrenList[index].content.cell = result.cellNum
            })
          })
          return resolve(childrenList)
        })
      }
    },
    onNodeExpand(data, node) {
      for (let grid of data.children) {
        if (grid.content.size === 0) {
          let gridName = 'Model_' + node.data.label + '-Grid_' + grid.label
          getGridSizeInfo(gridName).then((info) => {
            grid.content.size = this.renderSize(info.byteSize)
            grid.content.cell = info.cellNum
          })
        }
      }
    },
    onPackUp() {
      let allTreeNode = this.$refs.myTree.store._getAllNodes()
      for (let node of allTreeNode) {
        node.expanded = false
      }
    },
    renderSize(value) {
      if (value === null || value === '' || value === undefined) {
        return '0 Bytes'
      }
      let unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      let srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      //  保留的小数位数
      size = size.toFixed(0)
      return size + unitArr[index]
    }
  }

}
</script>

<style lang="scss">
.document-wrapper {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  height: 100%;
  .title-wrapper {
    color: white;
    font-size: 15px;
    height: 40px;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    .title {
      margin: 0;
      margin-left: 20px;
    }
  }
  .interval {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    background-color: #333333;
    color: gray;
    font-size: 17px;
    flex-shrink: 0;
    // box-shadow: 0px 10px 5px red;
    .interval-text {
      font-size: 10px;
      font-weight: bold;
      font-style: normal;
      margin: 0;
      line-height: 24px;
    }
    .interval-icon {
      margin-left: 5px;
    }
    .last {
      margin-right: 5px;
    }
  }
  .scroll-wrapper {
    overflow: auto;
    flex-grow: 1;
    flex-shrink: 1;
    &::-webkit-scrollbar {
      background-color: #252526;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #464647;
    }
    &::-webkit-scrollbar-thumb:window-inactive {
      background-color: #252526;
    }
  }
}
.el-tree {
  color: white;
  background-color: #252526;
  margin-left: 14px;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #004775;
}
.el-tree-node__content:hover {
  background-color: #37373e;
}
</style>
