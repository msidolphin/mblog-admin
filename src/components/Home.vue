<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn admin-logo-wrapper">
        <a href="/">
          <span>
            <i class="admin-logo iconfont my-icon-yingyongguanli"></i>
            <b style="color: red;font-size: 26px">A</b><b style="font-size: 24px; color: #ee9900;">D</b><b style="color: #fff;font-size: 24px;">M</b><b style="color: violet;font-size: 24px;">I</b><b style="color: #2276d2;font-size: 24px;">N</b>
         </span>
        </a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <!--<a href="/"><img src="../assets/logotxt.png"></a>-->
      </div>
      <div class="topbar-title">
        <!--<span>&nbsp;Power by Vue.js</span>-->
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="iconfont icon-user"></i> {{user.nickname}}
            <i class="iconfont icon-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="jumpTo('/settings/profile')"><span style="color: #555;font-size: 14px;">个人信息</span></div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="jumpTo('/settings/profile')"><span style="color: #555;font-size: 14px;">修改密码</span></div>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <!--<div class="menu-toggle" @click.prevent="collapse">-->
          <!--<i class="iconfont icon-menufold" v-show="!collapsed"></i>-->
          <!--<i class="iconfont icon-menuunfold" v-show="collapsed"></i>-->
        <!--</div>-->
        <!--导航菜单-->
        <side-bar/>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
  import SideBar from "./SideBar";
  import api from '@/api'
  import {mapGetters} from 'vuex'

  export default {
    components: {SideBar},
    name: 'home',
    created(){
     
    },
    data () {
      return {
        defaultActiveIndex: "0",
        nickname: '',
        collapsed: false,
      }
    },
    computed: mapGetters(['user']),
    methods: {
      handleSelect(index){
        this.defaultActiveIndex = index;
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      jumpTo(url){
        this.defaultActiveIndex = url;
        this.$router.push(url); //用go刷新
      },
      //注销
      logout(){
        api.logout().then(response => {
          this.$router.push('/login')
        }).catch(error => {

        })
      }

    },
    mounted() {

    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .admin-logo {
    color: #fff;
    font-size: 30px;
  }

  .admin-logo-wrapper:hover .admin-logo{
    color: #FFB752;
  }

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #19a97b;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      /*.topbar-btn:hover {*/
      /*background-color: #4A5064;*/
      /*}*/
      .topbar-logo {
        float: left;
        width: 180px;
        text-align: center;
        height: 100%;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
      }
      .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }

    aside {
      min-width: 50px;
      background: rgba(238,238,238,0.98);
      &::-webkit-scrollbar {
        display: none;
      }

      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
        border-right: 1px solid #e5e5e5;
      }

      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        /*background-color: #333744;*/
        border-right: 0px;
      }

      .el-submenu .el-menu-item {
        /*min-width: 60px;*/
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }

      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }

      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        /*background-color: #7ed2df;*/
      }
    }

    .menu-toggle {
      /*background: #4A5064;*/
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
