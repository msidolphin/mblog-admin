![vue](https://img.shields.io/badge/build-Vue2-brightgreen.svg)

## 介绍
> 一个基于vue2编写的博客后台管理系统

### 项目结构
```
├── build                  #webpack编译相关文件目录，一般不用动
├── config                 #配置目录
│   ├────dev.env.js     #开发环境变量
│   ├────index.js       #主配置文件
│   └────prod.env.js    #生产环境变量
├── dist                   #生产环境下build后的文件存放目录（发布目录）
├── src                    #前端项目源码目录
│   ├───—api            #封装的接口文件目录
│   ├───—assets         #资源目录
│   ├───—components     #组件目录
│   ├───—mock           #模拟数据目录
│   ├───—router         #路由目录
│   ├───—utils          #JS工具目录
│   ├───—views          #页面目录
│   ├───—App.vue        #项目入口文件
│   └────main.js        #项目的核心文件
├── static                 #静态资源目录
├── index.html             #首页入口文件，你可以添加一些 meta 信息或同统计代码啥的
├── package.json           #项目依赖
└── README.md              #项目的说明文档，markdown 格式
```

## 项目编译和运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```




