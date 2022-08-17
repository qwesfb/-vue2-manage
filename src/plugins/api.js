import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http =axios

//拦截器--请求
axios.interceptors.request.use(config =>{
    //console.log(config)
   config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}),err=>{
    return Promise.reject(err)
}
//拦截器--响应
axios.interceptors.response.use(res=>{
    return res;
}),err=>{
    return Promise.reject(err)
}