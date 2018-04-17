import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'
import Vue from 'vue'

const Axios = axios.create({
  baseURL: '/api',
  timeout: 10000,
  responseType: 'json',
  withCredentials: true,
  headers: {
    "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

//请求拦截
Axios.interceptors.request.use(request => {
  if('post' === request.method || 'put' === request.method || 'delete' === request.method) {
    //序列化
    request.data = qs.stringify(request.data)
    console.log(qs.stringify(request.data))
  }

  //若需要校验token，给请求头部带上token
  if(localStorage.token) {
    request.headers.Authorization = localStorage.token
  }

  return request
}, error => {

  Message({
    showClose: true,
    message: error,
    type: 'error'
  })

  return Promise.reject(error.data.error.message)
})

//响应拦截
Axios.interceptors.response.use(response => {
  return response
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
            if(200 === response.data.status || 200 === response.data.status) {
              resolve(response)
            }else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
        break
      case "DELETE":
        Axios.delete(url, data).then(response => {
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

export default {
  install(Vue, option) {
    Object.defineProperty(Vue.prototype, '$http', {value: Axios})
  }
}























