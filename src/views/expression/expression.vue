<template>
  <div class="expression-wrapper">
    <div class="title-wrapper">
      <p class="title">模型设置</p>
    </div>
    <div class="interval">
      <div>
        <i class="el-icon-arrow-down interval-icon"></i>
        <i class="interval-text interval-icon">MODEL SETTING</i>
      </div>
      <div>
        <i class="el-icon-refresh interval-icon"></i>
        <i class="el-icon-remove-outline interval-icon last"></i>
      </div>
    </div>
    <div class="component-1">
      <div class="flex-row">
        <i class="z-i">z-scale</i>
        <el-slider class="z-slider" v-model="zScale"></el-slider>
        <el-input class="input" size="mini" v-model.number="zScale"></el-input>
      </div>
      <div class="flex-row-text">
        <el-checkbox>显示面片</el-checkbox>
        <el-select size="mini"></el-select>
      </div>
      <div class="flex-row-text">
        <el-checkbox>显示线框</el-checkbox>
        <el-select size="mini">
          <el-option value="显示全部线框"></el-option>
          <el-option value="显示地层线框"></el-option>
        </el-select>
      </div>
      <hr />
      <div class="flex-row">
        <i class="ijk-i">i</i>
        <el-slider class="ijk-slider" range v-model="i"></el-slider>
        <el-input class="input" size="mini" v-model="i[0]"></el-input>
        <el-input class="input" size="mini" v-model="i[1]"></el-input>
      </div>
      <div class="flex-row">
        <i class="ijk-i">j</i>
        <el-slider class="ijk-slider" range v-model="j"></el-slider>
        <el-input class="input" size="mini" v-model="j[0]"></el-input>
        <el-input class="input" size="mini" v-model="j[1]"></el-input>
      </div>
      <div class="flex-row">
        <i class="ijk-i">k</i>
        <el-slider class="ijk-slider" range v-model="k"></el-slider>
        <el-input class="input" size="mini" v-model="k[0]"></el-input>
        <el-input class="input" size="mini" v-model="k[1]"></el-input>
      </div>
    </div>
    <div class="interval">
      <div>
        <i class="el-icon-arrow-down interval-icon"></i>
        <i class="interval-text interval-icon">CONTENT DISPLAY</i>
      </div>
      <div>
        <i class="el-icon-refresh interval-icon"></i>
        <i class="el-icon-remove-outline interval-icon last"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'expression',
  data() {
    return {
      zScale: 0,
      i: [0, 100],
      j: [0, 100],
      k: [0, 100]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.expression-wrapper {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-input__inner {
    color: white;
  }
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
  .component-1 {
    padding-bottom: 15px;
    padding-top: 15px;
    hr {
      margin-bottom: 20px;
      margin-top: 20px;
      border: none;
      background-color: #585958;
      height: 1px;
      width: 80%;
    }
    .ijk-i {
      font-style: normal;
      margin-right: 20px;
      width: 10px;
    }
    .z-i {
      font-style: normal;
    }
    .el-checkbox {
      color: white;
      .el-checkbox__inner {
        background-color: #252526;
        border: 1px solid white;
        border-radius: 0;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: white;
      }
    }
    .flex-row-text {
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 3px 30px 3px 30px;
      color: white;
      height: 30px;
    }
    .flex-row {
      display: -webkit-flex;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 3px 30px 3px 30px;
      color: white;
      height: 40px;
    }
    .el-select {
      width: 120px;
      height: 20px;
      .el-input__inner {
        height: 20px;
        &::-webkit-input-placeholder {
          color: #7e7e7f;
        }
      }
      .el-input--mini .el-input__icon {
        line-height: 20px;
      }
    }
    .el-slider {
      .el-slider__runway {
        height: 4px;
        .el-slider__button {
          width: 14px;
          height: 14px;
          border: 2px solid white;
          background-color: #404040;
        }
        .el-slider__bar {
          background-color: #7e7e7f;
          height: 4px;
        }
      }
    }
    .z-slider {
      width: 110px;
    }
    .ijk-slider {
      width: 120px;
      margin-right: 15px;
    }
    .input {
      width: 30px;
      height: 34px;
      .el-input__inner {
        width: 29px;
        height: 33px;
        padding: 0;
        border: 0;
        text-align: center;
        border-radius: 0;
        background-color: #404040;
      }
    }
  }
}
</style>
