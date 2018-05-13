<template>
  <div class="echarts-container">
    <v-header :name="title"/>
    <el-row class="filter-wrapper">
      <el-col :span="20" ></el-col>
    </el-row>
    <div id="bar-charts" style="width: 100%;height: 70%"></div>
  </div>
</template>

<script>
  import VHeader from '../comm/header'
  import {extend, tips} from '@/utils/utils'
  import api from '@/api'
  import echarts from 'echarts'
  export default {
    name: "index",
    components: {VHeader},
    data() {
      return {
        option: {},
        title: '',
        charts: {},
        defaultOption: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          itemStyle: {
            normal: {
              color(params) {
                var colorList = [
                  '#C1232B','#FCCE10','#E87C25','#60C0DD','#27727B',
                  '#FE8463','#9BCA63','#FAD860','#F3A43B', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#FCCE10','#E87C25','#60C0DD','#27727B',
                  '#FE8463','#9BCA63','#FAD860','#F3A43B', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#FCCE10','#E87C25','#60C0DD','#27727B',
                  '#FE8463','#9BCA63','#FAD860','#F3A43B', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#FCCE10','#E87C25','#60C0DD','#27727B',
                  '#FE8463','#9BCA63','#FAD860','#F3A43B', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#C1232B','#FCCE10','#E87C25','#60C0DD','#27727B',
                  '#FE8463','#9BCA63','#FAD860','#F3A43B', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      }
    },
    mounted() {
      this.charts = echarts.init(document.querySelector("#bar-charts"))
      //默认按月统计 0
      this.getData()
    },
    methods: {
      getData() {
          this.charts.showLoading();
          api.fetchTagBarReport({limit: 20}).then(response => {
            let data = response.data.data
            this.option = data.option
            this.title = data.title.text
            extend(this.option, this.defaultOption)
            this.option.xAxis = this.option.xaxis
            this.option.yAxis = this.option.yaxis
            this.charts.setOption(this.option)
            this.charts.hideLoading()
          }).catch(error => {
            tips('获取标签统计信息失败', 'error')
          })
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
