import axios from 'axios'
import { Message } from 'element-ui'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: 'https://e.gridworld.com.cn',
  timeout: 15000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 解决跨域问题
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

//  响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 若有错误则弹窗提示
    Message({
      message: error.message,
      type: 'error',
      duration: 5000
    })
  }
)

export default service
