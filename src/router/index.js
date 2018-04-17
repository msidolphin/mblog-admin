import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/views/Dashboard'

//博客系统相关

import ArticleManagement from '@/views/ArticleManagement'
import ArticleList       from '@/views/ArticleList'
import ArticleRecycle    from '@/views/ArticleRecycle'
import CommentManagement from '@/views/CommentManagement'
import TagManagement     from '@/views/TagManagement'
import Charts            from '@/views/charts/dashboard'
import Profile from '@/views/Profile'
import SystemSettings from '@/views/SystemSettings'
import Link from '@/views/Link'

import Cookie from 'js-cookie'

import api from '@/api'

import store from '@/store'
import types from '@/store/types'

import Login from '@/views/Login'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: '仪表盘',
      component: Home,
      redirect: '/dashboard',
      children: [
        {path: '/dashboard', component: Dashboard}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '博客系统管理',
      children: [
        {path: '/blog/articles', component: ArticleManagement},
        {path: '/blog/articles/recycle', component: ArticleRecycle},
        {path: '/blog/articles/list', component: ArticleList},
        {path: '/blog/articles/list/:page', component: ArticleList},
        {path: '/blog/articles/:id', component: ArticleManagement},
        {path: '/blog/comments', component: CommentManagement},
        {path: '/blog/comments/:page/:pageSize', component: CommentManagement},
        {path: '/blog/comments/list', redirect: '/blog/comment'},
        {path: '/blog/comments/list/:page/:pageSize', redirect: '/blog/comments/:page/:pageSize'},
        {path: '/blog/tags', component: TagManagement},
        {path: '/blog/reports', component: Charts}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      children: [
        {path: '/settings/system', component: SystemSettings},
        {path: '/settings/link', component: Link},
        {path: '/settings/profile', component: Profile},
        {path: '/settings/changepwd', component: Profile}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = Cookie.get("admin_access_token")
  //如果未携带令牌 则跳转到登录页面
  if(!token  && to.path !== '/login') {
    //设置登录成功后的重定向路由
    store.dispatch(types.SET_REDIRECT, to.path)
    router.push("/login")
  }else {
    //校验token合法性
    api.checkToken(token).then(response => {
      //设置用户信息
      store.dispatch(types.SET_USER, response.data.data)
      if(to.path === '/login') router.push("/dashboard")
      else next()
    }).catch(error => {
      //校验失败，跳转到登录页面
      if(to.path !== '/login') router.push("/login")
      else next()
    })
  }
})

export default router
