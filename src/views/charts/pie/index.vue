<template>
  <div class="echarts-container">
    <v-header :name="title"/>
    <div id="pie" style="width: 100%;height: 95%"></div>
  </div>
</template>

<script>
  import VHeader from '../comm/header'
  import {extend, tips} from '@/utils/utils'
  import api from '@/api'
  import echarts from 'echarts'
  export default {
    components: {VHeader},
    data() {
      return {
        option: {},
        currentIndex: -1,
        charts: {},
        title: null,
      }
    },
    mounted() {
      this.charts = echarts.init(document.querySelector("#pie"))
      this.init()
      this.startInterval()
    },
    methods: {
      init() {
        let defalutOption = {
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          }
        }
        this.charts.showLoading()
        api.fetchArtcilePieReport().then(response => {
          let data = response.data.data
          this.option = data.option
          this.title = data.title.text
          extend(this.option, defalutOption)
          this.charts.setOption(this.option)
          this.charts.hideLoading()
        }).catch(error => {
          console.log(error)
          tips('获取统计数据失败', 'error')
          this.charts.hideLoading()
        })
      },
      startInterval() {
        setInterval(()=>{
          var dataLen = this.option.series[0].data.length
          //清除之前图形的高亮效果
          this.charts.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: this.currentIndex
          })
          this.currentIndex = (this.currentIndex + 1) % dataLen
          //高亮当前图形
          this.charts.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: this.currentIndex
          })
          //显示tips
          this.charts.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: this.currentIndex
          })
        }, 2000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .echarts-container {
    width: 100%;
    height: 100%;
    .filter-wrapper {
      margin-top: 20px;
      padding-left: 120px;
    }
  }
</style>
