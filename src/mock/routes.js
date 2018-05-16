/**
 * Created by msidolphin on 2018/3/21.
 */
import mock from 'mockjs'

const Random = mock.Random

const routes =  [
  {
    path: '/dashboard',
    name: '首页',
    id:Random.guid(),
    leaf: true, // 只有一个节点
    menuShow: true,
    iconCls: 'iconfont my-icon-jianzhan', // 图标样式class
    children: [
      {path: '/dashboard', id:Random.guid(), menuShow: true}
    ]
  },
  {
    path: '/',
    name: '博客管理',
    id:Random.guid(),
    menuShow: true,
    iconCls: 'iconfont my-icon-wodechanpin',
    children: [
      {
        path: '/blog/articles',
        name: '文章管理',
        menuShow: true,
        id:Random.guid(),
        iconCls: 'iconfont my-icon-wodebiji',
        children: [
          {
            path: '/blog/articles',
            id:Random.guid(),
            name: '发布文章',
            menuShow: true,
          },
          {
            path: '/blog/articles/list',
            id:Random.guid(),
            name: '文章列表',
            menuShow: true,
          },
		      {
            path: '/blog/articles/recycle',
            id:Random.guid(),
            name: '回收站',
            menuShow: true,
          }
        ]
      },
      {path: '/blog/comments', id:Random.guid(), name: '评论管理', menuShow: true},
      {path: '/blog/tags', id:Random.guid(), name: '标签管理', menuShow: true},
      {path: '/blog/reports', id:Random.guid(), name: '统计分析', menuShow: true}
    ]
  },
  {
    path: '/',
    name: '设置',
    id:Random.guid(),
    menuShow: true,
    iconCls: 'iconfont my-icon-guanlizhongxin',
    children: [
      {path: '/settings/system', id:Random.guid(), name: '系统设置', menuShow: true},
      {path: '/settings/link', id:Random.guid(), name: '友情链接', menuShow: true},
      {path: '/settings/profile', id:Random.guid(), name: '个人信息', menuShow: true},
      // {path: '/settings/changepwd',id:Random.guid(), name: '修改密码', menuShow: true},
    ]
  }
]

//文章列表
// mock.mock(/\/article\/list[\/\d+]*/, {
//   'list|10': [
//     {
//       'id|+1': 1, //id 从1开始递增,
//       'name': '@name',
//       'title': '@ctitle',
//       'createTime': '@datetime',
//       'updateTime': '@datetime',
//       'list|1-3': ['@word'],
//       'comments': '@integer(0, 30)',
//       'views': '@integer(0, 1000)'
//     }
//   ]
// })

//评论列表
// mock.mock(/\/comment[\/\d+]*/, 'get', res => {
//   let pageSize = res.url.substring(res.url.lastIndexOf('/') + 1)
//   return mock.mock({
//     ['list|'+ pageSize]: [
//       {
//         'id|+1': 1, //id 从1开始递增,
//         'name': '@name',
//         'title': '@ctitle',
//         'email': '@email',
//         'createTime': '@datetime',
//         'website': '@url',
//         'status': '@boolean',
//         'content': '@cparagraph'
//       }
//     ]
//   })
// })

export default routes
