import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  //1.比如config中的一些信息不符合服务器要求
  //2.比如每次发送网络请求时，希望在界面中显示一个请求时的图标
  //3.某些网络请求（如登陆（token）），必须携带一些特殊的信息
  instance.interceptors.request.use(config1 => {
    // console.log(config1);
    config1.headers.Authorization = sessionStorage.getItem('token')
    return config1
  })
  return instance(config)
}