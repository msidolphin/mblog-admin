/**
 * Created by msidolphin on 2018/4/5.
 */
import axios from 'axios'
import qs from 'qs'

const Axios = axios.create({
  baseURL: '/api/admin',
  timeout: 10000,
  responseType: 'json',
  withCredentials: true
})

Axios.$request = function (url, type, data) {
  return new Promise((resolve, reject) => {
    switch (type.toUpperCase()) {
      case "GET":
        Axios.get(url, {params: data}).then((response)=>{
          if(200 === response.data.status) {
            resolve(response)
          }else {
            reject(response)
          }
        }).catch((error)=>{
          reject(error)
        })
        break
      case "POST":
        Axios.post(url, data).then(response => {
          if(201 === response.data.status || 200 === response.data.status) {
            resolve(response)
          }else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })

        break
      case "PUT":
        Axios.put(url, data).then(response => {
          if(204 === response.data.status || 200 === response.data.status) {
            resolve(response)
          }else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
        break
      case "DELETE":
        Axios.delete(url, {data: data}).then(response => {
          if(204 === response.data.status || 200 === response.data.status) {
            resolve(response)
          }else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
    }
  })
}

const api = {
  //校验token是否有效
  checkToken(token) {
    return Axios.$request('/users', 'post', {accessToken: token})
  },
  //登录
  login(username, password) {
    return Axios.$request('/users', 'post', {username, password})
  },
  //注销
  logout() {
    return Axios.$request('/users/logout', 'get')
  },
  //获取评论列表
  fetchComments(query) {
    return Axios.$request('/comments', 'get', query)
  },
  //更新评论状态
  updateCommentStatus(id, status) {
    return Axios.$request('/comments', 'put', {id, status})
  },
  //更新回复状态
  updateReplyStatus(id, status) {
    return Axios.$request('/replies', 'put', {id, status})
  },
  logicDeleteArticle(id) {
    return Axios.$request('/articles', 'put', {id})
  },
  physicalDeleteArticle(id) {
    return Axios.$request('/articles', 'delete', {id})
  },
  recoverArticle(id) {
    return Axios.$request('/articles/' + id, 'post')
  },
  //获取标签列表
  fetchTags(query) {
    return Axios.$request('/tags', 'get', query)
  },
  saveTag(payload) {
    return Axios.$request('/tags', 'put', {...payload})
  },
  //获取配置列表
  fetchSettings(query) {
    return Axios.$request('/settings', 'get', query)
  },
  saveSetting(payload) {
    return Axios.$request('/settings', 'put', {...payload})
  },
  fetchLinks(query) {
    return Axios.$request('/links', 'get', query)
  },
  saveLink(payload) {
    return Axios.$request('/links', 'post', payload)
  },
  deleteLink(id) {
    return Axios.$request('/links', 'delete', {id})
  },
  saveUser(payload) {
    if(!payload.id) return null
    console.log(payload)
    return Axios.$request('/users/' + payload.id, 'post', payload)
  },

  //获取统计结果
  fetchTagBarReport(limit) {
    return Axios.$request('/tags/reports/bar', 'get', limit)
  },
  fecthArticleLineReport(payload) {
    return Axios.$request('/articles/reports/line', 'get', payload)
  },
  fetchArtcilePieReport() {
    return Axios.$request('/articles/reports/pie', 'get')
  },
  //获取仪表盘内容
  fetchDashboard() {
    return Axios.$request('/dashboard', 'get')
  },
  //获取用户信息
  fetchUserInfo() {

  }
}

export default api
