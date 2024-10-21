import {useUserStore} from '@/stores'
import router from '@/router'
import axios, {AxiosError, type Method} from 'axios'
import {showToast,showFailToast} from 'vant'

const baseURL = 'https://consult-api.itheima.net'
const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 10000
})

//请求拦截器
instance.interceptors.request.use(
    //config是请求的配置信息
    (config) => {
        // TODO 2. 携带token
        const store = useUserStore()
        if (store.user?.token && config.headers) {
            config.headers['Authorization'] = `Bearer ${store.user?.token}`
        }
        return config
    },
    (err) => Promise.reject(err)
)
//响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 3. 处理业务失败
        if (res.data.code !== 10000) {
            showFailToast(res.data?.message || '业务失败')
            return Promise.reject(res.data)
        }
        // TODO 4. 摘取核心响应数据
        return res.data
    },
    (err) => {
        // TODO 5. 处理401错误
        if (err.response.status === 401) {
            showFailToast( '登录过期，请重新登录')
            const store = useUserStore()
            store.delUser()
            //回到登录页面
            router.push({
                path: '/login',
                query: {returnUrl: router.currentRoute.value.fullPath}  //记录退出时的路径
            })
        }
        return Promise.reject(err)
    }
)

//整个响应数据的类型声明，T是实际所需数据的类型，在实际获取时再确定
type ResData<T>={
    code: number
    message: string
    data: T
}

//请求通用工具函数
const request = <T>(url: string, method: Method = 'get', submitData?: object)=> {
    //return回来一个data，和一个包含data的整个响应数据
    return instance.request<T, ResData<T>>({
        url,
        method,
        // GET请求使用params，POST请求使用data
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}

export {baseURL, instance,request}