<template>
    <div class="echarts-container">
      <v-header :name="title"/>
      <el-row class="filter-wrapper">
        <el-col :span="20" >
          <el-form :inline="true">
            <el-form-item>
              <el-select ref="typeInput" v-model="type" placeholder="请选择统计方式">
                <el-option label="按月" value="0"></el-option>
                <el-option label="按年" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="type == 0 || type == '按月'">
              <el-date-picker
                align="right"
                type="year"
                v-model="year"
                format="yyyy年"
                value-format="yyyy"
                placeholder="请选择统计年份">
              </el-date-picker>
            </el-form-item>
          <el-form-item v-if="type == 1 || type === '按年'">
            <el-date-picker
              align="right"
              type="year"
              format="yyyy年"
              value-format="yyyy"
              v-model="start"
              placeholder="请选择开始年份">
            </el-date-picker>
          </el-form-item>
            <el-form-item v-if="type == 1  || type === '按年'">
              <el-date-picker
                align="right"
                type="year"
                format="yyyy年"
                value-format="yyyy"
                v-model="end"
                placeholder="请选择结束年份">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
             <el-button type="primary" @click="statist">统计</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div id="line-stack" style="width: 100%;height: 70%"></div>
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
        type: '按月',
        start: null,
        end: null,
        year: null,
        charts: {}
      }
    },
    mounted() {
      this.charts = echarts.init(document.querySelector("#line-stack"))
      //默认按月统计 0
      this.getData(0)
    },
    methods: {
      getData(type) {
        this.charts.showLoading();
        api.fecthArticleLineReport({
          type: type,
          specific: this.year,
          start: this.start,
          end: this.end
        }).then(response => {
          let data = response.data.data
          this.title = data.title.text
          this.option = data.option

          let defaultOption = {
            tooltip: {
              trigger:'axis'
            },
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }
          extend(this.option, defaultOption)
          this.option.xAxis = this.option.xaxis
          this.option.yAxis = this.option.yaxis
          this.charts.setOption(this.option)
          this.charts.hideLoading()
        }).catch(error => {
          tips('获取统计数据失败', 'error')
          this.charts.hideLoading()
        })
      },
      statist() {
        if(this.type === '按月' || this.type == 0) this.getData(0)
        else if(this.type === '按年' || this.type == 1) this.getData(1)
        else tips('请选择正确的统计方式', 'error')
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
