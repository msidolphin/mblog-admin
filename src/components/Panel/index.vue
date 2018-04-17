
<style lang="scss" scoped>
  .panel-wrapper {
    padding: 25px 25px;
    width: 400px;
    height: 100px;
    position: relative;
    border-radius: 10px;
    .icon-wrapper {
      display: inline-block;
      transform: translateY(15%);
      /*line-height: 100px;*/
      left: 10%;
      i {
        font-size: 60px;
        color: #fff;
      }
    }
    .panel-content {
      display: inline-block;
      margin-left: 40%;
      transform: translateY(30%);
      .panel-data {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
      }
      .panel-title {
        padding-top: 5px;
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .panel-wrapper.primary {
    background: #6a8abe;
    box-shadow: 0 5px 0 #5f7cab;
  }
</style>

<template>
  <div class='panel-wrapper' :style="{background: type.background, boxShadow:type.boxShadow}">
    <div class="icon-wrapper">
      <i :class="icon"></i>
    </div>
    <div class="panel-content">
      <div class="panel-data">{{ value }}</div>
      <div class="panel-title">{{  title }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        default: 0
      },
      title: {
        default: 'Panel'
      },
      icon: {
        default: 'fa fa-newspaper-o'
      },
      type: {
        default() {
          return {
            background: '#6a8abe',
            boxShadow: '0 5px 0 #5f7cab'
          }
        }
      }
    },
    data() {
      return {
      }
    }
  }
</script>
