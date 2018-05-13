<template lang="html">
	<div class="dashboard">
		<div class="flex-container column">
			<!-- scale 缩放  translate 2d变换 第一个参数是水平方向(x) 第二个是垂直方向(y) 34% -->
			<div class="item one" @click="clickChart(1)" style="transform: translate(-22.4%, -33.5%) scale(0.33)">
				<bar/>
			</div>
			<div class="item two" @click="clickChart(2)" style="transform: translate(-22.4%,0.5%) scale(0.33)">
				<div id="hotArticle" style="width: 100%; height: 100%;"></div>
			</div>
			<div class="item three" @click="clickChart(3)" style="transform: translate(-22.4%,34.5%) scale(0.33)">
				<pie/>
			</div>
			<div class="item four active" @click="clickChart(4)" style="transform: translate(45%, 0) scale(1)">
				<line-charts/>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
  import LineCharts from './line'
	import Pie      from './pie'
  import Bar      from './bar'
  import api from '@/api'
	export default {
		components: {Pie, LineCharts, Bar},
		data() {
			return {
				items: [],
        hoiCharts: null
			}
		},
		mounted() {
      this.hotCharts = echarts.init(document.querySelector("#hotArticle"))
			this.init()
			this.initBar()
		},
		methods: {
			init() {
				this.items = document.querySelectorAll(".flex-container .item")
				for(let i = 0 ; i < this.items.length ; ++i) {
					this.items[i].dataset.order = i + 1
				}
			},
      initHottestArticlesCharts(data) {
        if (!data) {
          this.hotCharts.hideLoading()
          return
        }
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var option = {
          color: colors,
          title: {
            text: '热门文章'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'}
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            feature: {
              // dataView: {show: true, readOnly: false},
              // restore: {show: true},
              // saveAsImage: {show: true}
            }
          },
          legend: {
            data:['点赞数','阅览数','评论数']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: data.titles
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '点赞数',
              min: 0,
              minInterval: 1,
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '评论数',
              min: 0,
              minInterval: 1,
              position: 'right',
              offset: 80,
              axisLine: {
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '阅览数',
              min: 0,
              minInterval: 1,
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name:'点赞数',
              type:'bar',
              data: data.votes
            },
            {
              name:'评论数',
              type:'bar',
              yAxisIndex: 1,
              data: data.replies
            },
            {
              name:'阅览数',
              type:'line',
              yAxisIndex: 2,
              data: data.views
            }
          ]
        };
        this.hotCharts.setOption(option)
        this.hotCharts.hideLoading()
      },
			initBar() {
        api.fetchHottestArticleReport().then(response => {
          if (response.data && response.data.data) this.initHottestArticlesCharts(response.data.data)
          else this.hotCharts.hideLoading()
        }).catch(() => {
          this.hotCharts.hideLoading()
        })
			},
			clickChart(index) {
				let activeItem = document.querySelector(".flex-container .active")
				let activeIndex = activeItem.dataset.order
				let clickItem = this.items[index - 1]
				//如果点击的是当前元素
				if(activeIndex == index) return
				//将原来活动的项移除active样式
				activeItem.classList.remove("active")
				clickItem.classList.add("active")
				this.setStyle(clickItem, activeItem)
			},
			 setStyle(el1, el2) {
		      let transform1 = el1.style.transform
		      let transform2 = el2.style.transform
		      el1.style.transform = transform2
		      el2.style.transform = transform1
		    }
		},

	}
</script>

<style lang="scss" scoped>
	.dashboard {
		position: relative;
		width: 100%;
		height: 800px;
		margin: 0;
		padding: 0;
		/*background-image: url('./bg.jpg');*/
		.flex-container {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
			margin: 0 auto 0 auto;
			box-sizing: content-box;
			.item {
				padding: 0;
				margin: 0;
				width: 68%;
				height: 100%;
				position: absolute;
				/*text-align: center;*/
				/*background: rgba(32, 32, 35, 0.5);*/
				transition: all 0.8s;
				transform: scale(0.33);
				.active {
					height: 100%;
					width: 69%;
					margin-left: 50px;
					line-height: 300px;
				}
			}
		}
	}
</style>
