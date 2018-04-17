<template>
	<div class="container">
		<div class="box-card login-container" style="width: 300px;margin:0 auto;">
			<div class="header" style="text-align: center;">
				<img src="../assets/vue-logo.png" style="display: inline-block;width:20%;height:20%;">
			</div>
		    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
	           class="demo-ruleForm">
			    <h3 class="title">后台管理系统</h3>
			    <el-form-item prop="username">
			      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入您的账号">
              <template slot="prepend"><i class="fa fa-user"></i></template>
            </el-input>
			    </el-form-item>
			    <el-form-item prop="password">
			      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入您的密码">
              <template slot="prepend"><i class="fa fa-lock"></i></template>
            </el-input>
			    </el-form-item>
			    <!--<a class="forget-pass">忘记密码？</a>-->
			    <el-form-item style="width:100%;">
			      <el-button type="success" class="login-btn" style="width:100%;" @click.native.prevent="login" :loading="loading">登录</el-button>
			    </el-form-item>
			  </el-form>
		</div>
	</div>
</template>

<script>
  import api from '@/api'
  import Cookie from 'js-cookie'
  import {mapGetters} from 'vuex'
  import {tips} from '@/utils/utils'
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
        },
        loading: false,
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        }
      };
    },
    computed: {
      ...mapGetters(['redirect'])
    },
    methods: {
      login() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            //请求后端
            let loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
              target: document.querySelector('body')
            })
            api.login(this.loginForm.username, this.loginForm.password).then(response => {
              loading.close()
              if(response.status === 200) this.$router.push(this.redirect || "/dashboard") //登录成功跳转到首页
            }).catch(error => {
              loading.close()
              if(error.data.status === 404) {
                tips('用户名不存在', 'error')
              }else if(error.data.status === 400) {
                tips('用户名或密码错误', 'error')
              }else {
                tips('未知错误', 'error')
              }

            })
          }
        })
      }
    }
  }
</script>
<style>
  html {
    height: 100%;
  }
  body {
    /*background: #DFE9FB;*/
    background-color: #C7EDCC;
    /*background: url("../assets/login-bg.jpg") no-repeat;*/
    /*background-position: center 0;*/
    height: 100%;
  }
</style>
<style lang="scss" scoped>
	.container {
		height: 100%;
		width: 100%;
		.login-container {
      /* vertical */
      transform: translateY(50%);

      /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      width: 350px;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;

      background: -ms-linear-gradient(top, #ace, #00C1DE); /* IE 10 */
      background: -moz-linear-gradient(top, #ace, #00C1DE); /*火狐*/
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)); /*谷歌*/
      background: -webkit-linear-gradient(top, #ace, #00C1DE); /*Safari5.1 Chrome 10+*/
      background: -o-linear-gradient(top, #ace, #00C1DE); /*Opera 11.10+*/

      .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
      }
      .remember {
        margin: 0px 0px 35px 0px;
      }
      .forget-pass {
        margin-left: 75%;
        cursor: pointer;
        transition: 0.5s;
      }
      .forget-pass:hover {
        color: #42b983;
      }
      .login-btn {
        background-color: #42b983;
        border: 0;
        margin-top: 10px;
      }
    }
	}

</style>
