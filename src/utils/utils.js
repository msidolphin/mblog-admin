/**
 * Created by msidolphin on 2018/3/28.
 */

import {Message} from 'element-ui'

export function tips(msg, type) {
  if(!type) {
    type = 'info'
  }
  Message({
    message: msg,
    type: type,
    showClose: true,
    duration: 2000
  })
}

export function validate(value, type) {
  if("required" === type) {
    //非空验证
    return !(value === null || $.trim(value) === "")
  }
  //验证是否为合法的手机号码
  if("phone" === type) {
    return /^1\d{10}$/.test(value)
  }
  //验证是否为合法邮箱
  if("email" === type) {
    return /^\w+@\w+(\.\w+)+$/.test(value)
  }
  //验证是否为数字
  if("number" === type) {
    return !isNaN(value)
  }
  //邮政编码验证
  if(type === "zip") {
    return /^\d{6}$/.test(value)
  }
  return false
}

export function extend(target, source) {
  for (let p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p]
    }
  }
  return target;
}

