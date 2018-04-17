<template lang="html">
    <div class="charts-title">
      <h1>{{name}}</h1>
    </div>
</template>

<script>
	export default {
		props: {
			name: String
		}
	}
</script>

<style lang="scss">
  .charts-title {
    position: relative;
    height: 50px;
    line-height: 50px;
    /*background-color: rgb;*/
    width: 100%;
    text-align: center;
    .h1 {
      flex: 0 0 120px;
      font-size: 21px;
      font-weight: bold;
      padding: 0;
      margin: 0;
      padding-left: 20px;
    }
  }
</style>
